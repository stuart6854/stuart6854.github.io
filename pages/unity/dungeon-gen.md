---
title: "Dungeon Generation"
---

The algorithm can be broken down into three components, the dungeon, the room, and each opening within a room.  Each component will follow a simple set of steps until the dungeon is finished being generated.

Dungeon’s Perspective
1. Spawn a room
2. Get the first available room that has unconnected openings
3. Tell the room to spawn its’ adjacent chambers
4. Wait until the room’s openings have spawned
5. Add Created Rooms to the dungeon
6. Repeat 2 – 6 until there are no more unconnected openings

Room’s Perspective
1. Get all the room openings
2. Iterate over each opening and spawn adjacent chamber
3. Wait until all adjacent chambers are spawned and are in a valid state
4. Notify dungeon new rooms are ready

Room Opening Level
1. Get available pieces from the dungeon to spawn
2. Spawn a connected piece
3. Wait for the validation period to complete
4. Mark the opening as connected and notify the room that a connected chamber is ready

New Room Validation
- A room becomes invalid if it intersects another room
- If it becomes invalid then the room will destroy itself and notify the connection point to try a different piece.
- If all the pieces are attempted and nothing will fit, then the connection point will close off the room with a wall instead.
