# LAIG 2020/2021 - TP2

## Group T02G05
| Name                      | Number    | E-Mail               |
| ------------------------- | --------- | ------------------   |
| Luís Miguel Pinto         | 201806206 | up201806206@fe.up.pt |
| Nuno Oliveira             | 201806525 | up201806525@fe.up.pt |


----
## Project information

### Scene
  - (Brief description of the created scene)
  - (relative link to the scene)

### Main Strong Points
  - Parsing support for KeyFrame Animations, SpriteText, SpriteAnimation and various NURBS objects: Plane, Patch and Defbarrel
  - Fully functional KeyFrame Animations 
  - Spritesheet based animations with user chosen start and end cells and duration
  - Spritesheet based text with most of the relevant ASCII characters
  - Both Sprite Animations and Text can have transparency activated
  - Planes draws a proper 1x1 square using NURBS
  - Patch draws NURBS based objects with the controlPoints it receives
  - Defbarrel draws half a barrel with varying angle, height, base readius and middle radius

### Adittional Features
  - Nodes that subscribe an animation stay invisible until the first KeyFrame
  - Animations block on xml is optional
  - Some values on the primites like npartsU and npartsV have defaults
  - Defbarrel has optional angle parameter. If it is not specificied 20º will be used as default
  - Badly declared leafs on xml will not cause any errors. Instead it will produce a warning and will not be drawn

----
## Issues/Problems
  - chars '<' and '>' can't be used with SpriteTexts due to lib limitations
