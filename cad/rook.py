#!/usr/bin/env python3
"""Brutalist rook — signature chess piece for the portfolio.

A castellated tower in the brutalist idiom: chamfered plinth, tapered
shaft punched with window slots, cantilevered crown ring, six merlons,
and a single accent doorway. One parametric build, two material exports:
  - rook_concrete.glb  (grays + signal red, for the Brutalist dark theme)
  - rook_cream.glb     (ivory + persimmon, for the Layered Depth light theme)

Run:  uvx --from build123d python cad/rook.py
"""

import math

from build123d import (
    Axis,
    Box,
    Color,
    Compound,
    Cone,
    Cylinder,
    Pos,
    Rot,
    chamfer,
    export_gltf,
)

# ---------------------------------------------------------------- geometry
# All dimensions in mm; total height ~210.

PLINTH_W, PLINTH_H = 110, 22
PLINTH2_W, PLINTH2_H = 92, 14
SHAFT_R_BOT, SHAFT_R_TOP, SHAFT_H = 42, 36, 120
CROWN_R, CROWN_H = 50, 30
MERLONS = 6


def build_rook():
    """Return dict of named solids (uncolored)."""
    z = 0.0

    # Two stacked square plinths, chamfered top edges
    plinth1 = Box(PLINTH_W, PLINTH_W, PLINTH_H)
    plinth1 = chamfer(plinth1.edges().group_by(Axis.Z)[-1], 4)
    plinth1 = Pos(0, 0, z + PLINTH_H / 2) * plinth1
    z += PLINTH_H

    plinth2 = Box(PLINTH2_W, PLINTH2_W, PLINTH2_H)
    plinth2 = chamfer(plinth2.edges().group_by(Axis.Z)[-1], 3)
    plinth2 = Pos(0, 0, z + PLINTH2_H / 2) * plinth2
    z += PLINTH2_H

    # Tapered shaft
    shaft = Cone(
        bottom_radius=SHAFT_R_BOT, top_radius=SHAFT_R_TOP, height=SHAFT_H
    )
    shaft = Pos(0, 0, z + SHAFT_H / 2) * shaft
    shaft_z0 = z
    z += SHAFT_H

    # Window slots: 8 columns x 4 rows of deep rectangular cuts, radial
    slot = Box(7, 30, 14)  # w, radial depth, h
    for col in range(8):
        ang = col * 45.0
        for row in range(4):
            sz = shaft_z0 + 24 + row * 24
            r_at = SHAFT_R_BOT - (SHAFT_R_BOT - SHAFT_R_TOP) * (
                (sz - shaft_z0) / SHAFT_H
            )
            cut = Pos(0, r_at - 6, sz) * slot
            cut = Rot(0, 0, ang) * cut
            shaft -= cut

    # Doorway void at the base of the shaft + accent door inside it
    door_void = Rot(0, 0, 22.5) * (Pos(0, SHAFT_R_BOT - 9, shaft_z0 + 16) * Box(20, 22, 34))
    shaft -= door_void
    door = Rot(0, 0, 22.5) * (Pos(0, SHAFT_R_BOT - 13, shaft_z0 + 15) * Box(18, 6, 30))

    # Cantilevered crown ring (overhangs the shaft) with chamfered underside
    crown = Cylinder(radius=CROWN_R, height=CROWN_H)
    crown = chamfer(crown.edges().group_by(Axis.Z)[0], 6)
    crown = Pos(0, 0, z + CROWN_H / 2) * crown

    # Crenellations: cut notches through the crown top
    notch = Box(2 * CROWN_R + 10, 16, 16)
    for k in range(MERLONS // 2):
        ang = k * (180.0 / (MERLONS // 2)) + 30.0
        cut = Pos(0, 0, z + CROWN_H - 7) * Rot(0, 0, ang) * notch
        crown -= cut

    # Inner court: shallow circular recess inside the crown top
    crown -= Pos(0, 0, z + CROWN_H - 5) * Cylinder(radius=CROWN_R - 14, height=12)

    return {
        "plinth1": plinth1,
        "plinth2": plinth2,
        "shaft": shaft,
        "crown": crown,
        "door": door,
    }


# ---------------------------------------------------------------- palettes
PALETTES = {
    "concrete": {
        "plinth1": Color(0.43, 0.43, 0.42),  # #6e6e6a
        "plinth2": Color(0.60, 0.60, 0.59),
        "shaft": Color(0.60, 0.60, 0.59),    # #9a9a96
        "crown": Color(0.43, 0.43, 0.42),
        "door": Color(1.00, 0.17, 0.00),     # #ff2b00 signal red
    },
    "cream": {
        "plinth1": Color(0.86, 0.82, 0.74),
        "plinth2": Color(0.97, 0.95, 0.90),  # ivory #f7f1e6-ish
        "shaft": Color(0.97, 0.95, 0.90),
        "crown": Color(0.86, 0.82, 0.74),
        "door": Color(1.00, 0.35, 0.21),     # persimmon #ff5a36
    },
}

solids = build_rook()
bbox = Compound(children=list(solids.values())).bounding_box()
print(
    f"Rook size: {bbox.max.X - bbox.min.X:.1f} x "
    f"{bbox.max.Y - bbox.min.Y:.1f} x {bbox.max.Z - bbox.min.Z:.1f} mm"
)

for name, palette in PALETTES.items():
    parts = []
    for key, solid in build_rook().items():
        solid.color = palette[key]
        solid.label = key
        parts.append(solid)
    out = f"cad/rook_{name}.glb"
    export_gltf(Compound(children=parts), out, binary=True)
    print(f"Exported {out}")
