#!/usr/bin/env python3
"""Retro CRT terminal desk set — parametric CAD model.

Monitor (lofted CRT taper) + stand, sloped keyboard with full key grid,
and a floppy disk. Exports a colored GLB for use in the portfolio's
3D scenes (drei useGLTF).

Run:  uvx --from build123d python cad/crt_terminal.py
"""

from build123d import (
    Axis,
    Box,
    Color,
    Compound,
    Cone,
    Cylinder,
    Location,
    Plane,
    Polygon,
    Pos,
    Rectangle,
    RectangleRounded,
    Rot,
    chamfer,
    export_gltf,
    extrude,
    loft,
)

# ---------------------------------------------------------------- palette
PLASTIC = Color(0.13, 0.15, 0.13)
PLASTIC_DARK = Color(0.10, 0.11, 0.10)
GLASS = Color(0.02, 0.13, 0.05)
KEY = Color(0.17, 0.19, 0.17)
KEY_ACCENT = Color(0.22, 1.00, 0.35)
FLOPPY = Color(0.12, 0.12, 0.16)
LABEL = Color(0.86, 0.83, 0.72)
SHUTTER = Color(0.60, 0.62, 0.66)

parts: list = []


def add(part, color, label):
    part.color = color
    part.label = label
    parts.append(part)
    return part


# ---------------------------------------------------------------- monitor
# Lofted CRT body: constant front section, tapering tube to the rear.
# Built with depth along -Z, then rotated so depth runs along +Y.
sections = [
    Plane.XY * RectangleRounded(200, 160, 12),
    Plane.XY.offset(-55) * RectangleRounded(196, 156, 12),
    Plane.XY.offset(-150) * RectangleRounded(118, 104, 18),
]
mon = loft(sections)

# Screen recess + chamfered opening
recess = extrude(Plane.XY * RectangleRounded(160, 118, 8), amount=-12)
mon -= recess
try:
    front_edges = mon.edges().group_by(Axis.Z)[-1]
    mon = chamfer(front_edges, 2.0)
except Exception:
    pass  # chamfer is cosmetic; never fail the build on it

mon = Rot(90, 0, 0) * mon  # depth now +Y, height +Z
mon = Pos(0, -30, 114) * mon
add(mon, PLASTIC, "monitor_shell")

# Screen glass, slightly sunk into the recess
glass = extrude(Plane.XY * RectangleRounded(154, 112, 8), amount=-6)
glass = Rot(90, 0, 0) * glass
glass = Pos(0, -26, 114) * glass
add(glass, GLASS, "screen_glass")

# ---------------------------------------------------------------- stand
base = Cone(bottom_radius=55, top_radius=45, height=16)
base = Pos(0, 20, 8) * base
add(base, PLASTIC_DARK, "stand_base")

neck = Cylinder(radius=18, height=26)
neck = Pos(0, 20, 16 + 13) * neck
add(neck, PLASTIC_DARK, "stand_neck")

# ---------------------------------------------------------------- keyboard
# Wedge profile in YZ, extruded across X.
profile = Polygon(
    (-180, 0), (-100, 0), (-100, 18), (-180, 8),
    align=None,
)
wedge = extrude(Plane.YZ * profile, amount=110, both=True)
add(wedge, PLASTIC, "keyboard_body")


def slope_z(y: float) -> float:
    """Top surface height of the wedge at depth y."""
    return 8.0 + (y + 180.0) * (18.0 - 8.0) / 80.0


# Key template: chamfered cap, built once, placed 57x.
key_template = Box(14, 14, 6)
try:
    key_template = chamfer(key_template.edges().group_by(Axis.Z)[-1], 1.2)
except Exception:
    pass

# Back (tallest) to front: number row first, spacebar row added after.
rows = [
    (-110.0, 14),  # number row
    (-126.0, 14),
    (-142.0, 13),
    (-158.0, 12),
]
# NOTE: colors must be set on each leaf solid — Compound.color does not
# propagate to children in the glTF export.
key_i = 0
for row_i, (y, count) in enumerate(rows):
    pitch = 15.5
    x0 = -(count - 1) * pitch / 2
    for i in range(count):
        loc = Location((x0 + i * pitch, y, slope_z(y) + 1.0))
        cap = key_template.moved(loc)
        # Esc (top-left) and Return (right of 3rd row) get accent caps
        accent = (row_i == 0 and i == 0) or (row_i == 2 and i == count - 1)
        add(cap, KEY_ACCENT if accent else KEY, f"key_{key_i}")
        key_i += 1

# Spacebar row
space = Box(72, 14, 6)
try:
    space = chamfer(space.edges().group_by(Axis.Z)[-1], 1.2)
except Exception:
    pass
space = space.moved(Location((0, -174.0, slope_z(-174) + 1.0)))
add(space, KEY, "spacebar")

# Power LED on the bezel, bottom-right
led = Cylinder(radius=3, height=3)
led = Rot(90, 0, 0) * led
led = Pos(86, -31, 114 - 70) * led
add(led, KEY_ACCENT, "power_led")

# ---------------------------------------------------------------- floppy
# Transform each part individually so per-solid colors survive export.
disk_at = Pos(172, -135, 1.5) * Rot(0, 0, 14)
add(disk_at * Box(90, 93, 3), FLOPPY, "floppy_body")
add(disk_at * Pos(0, -24, 1.8) * Box(62, 32, 0.8), LABEL, "floppy_label")
add(disk_at * Pos(0, 34, 1.8) * Box(30, 20, 0.8), SHUTTER, "floppy_shutter")

# ---------------------------------------------------------------- export
assembly = Compound(children=parts)
bbox = assembly.bounding_box()
print(
    f"Size: {bbox.max.X - bbox.min.X:.1f} x "
    f"{bbox.max.Y - bbox.min.Y:.1f} x "
    f"{bbox.max.Z - bbox.min.Z:.1f} mm"
)
print(f"Top-level parts: {len(parts)}")

export_gltf(assembly, "cad/crt_terminal.glb", binary=True)
print("Exported cad/crt_terminal.glb")
