# LAIG 2020/2021

## Group T02G05
| Name                      | Number    | E-Mail               |
| ------------------------- | --------- | ------------------   |
| Luís Miguel Pinto         | 201806206 | up201806206@fe.up.pt |
| Nuno Oliveira             | 201806525 | up201806525@fe.up.pt |

----

## Projects

### [TP1 - Scene Graph](TP1)

#### Scene
  - The scene we created is a simple outdoor dinning table with an orange, a donut, a napkin, a can of coke and 6 chairs
  - There are also 2 floors, a wall, a BBQ stand and a lamp (with its own light source) to light up the table
  - [Scene Running](https://web.fe.up.pt/~up201806206/laig/TP1/)
  - [Scene XML](./TP1/scenes/envio.xml)
  - [TP1](./TP1)

#### Main Strong Points
  - All primitives have been implemented
  - Heritage working properly for both materials and textures
  - Texture amplification working aswell
  - Each node applies "clear" material properly if needed and applies our own default material
  - Transformations all work as they should
  - GUI implemented with a dropdown for cameras, a folder with checkboxes for each light and another checkbox to visualize every light source

#### Additional features
  - Vectors have default values for each element and a warning is produced in case of any error or missing value. Examples: RGBA, Transformations, Lights and each of its components, Cameras, Afs and Aft, Ambient and Background
  - Materials, Textures, Transformations, Amplification and Descendants can be omitted and produce a warning
  - Maximum number of lights accepted is 8 and minimum is 0 (everything will be very dark obviously)
  - There is a default camera that is used if none is declared on the XML
  - If no root is declared according to this project's syntax we will try to find a node without any parent and use it as root. Of course this may not allways work properly if there are more than 1 node with no parent. If none is found we will simply use the first one
  - Created and unreferenced nodes are indentified and produce a warning

-----

### [TP2 - Method Enhancement](TP2)
## Project information

### Scene
  - The scene we created is a simple outdoor dinning table with an orange, a donut, a napkin, a can of coke and 6 chairs
  - There are also 2 floors, a wall, a BBQ stand and a lamp (with its own light source) to light up the table
  - In this second project we added a fire to the BBQ stand (spritesheet animation), text to the wall (sprite text), animations to multiple items on the table and chairs (keyframe animations), a wine barrel and a bar counter (both NURBS surfaces)
  - We added a small easter egg in the form of a jump scare :)
  - [Scene Running](https://web.fe.up.pt/~up201806206/laig/TP2/)
  - [Scene XML](./TP2/scenes/LAIG_TP2_T2_G05.xml)
  - [TP2](./TP2)

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
  - Some values on the primitives like npartsU and npartsV have defaults
  - Defbarrel has optional angle parameter. If it is not specificied 30º will be used as default
  - Badly declared leafs on xml will not cause any errors. Instead it will produce a warning and will not be drawn

### Issues/Problems
  - chars '<' and '>' can't be used with SpriteTexts due to CGF lib limitations


----

### [TP3 - 3D Interface for a game - White and Tan](TP3)
## Project information
### Scene
  - Two different scenes to run the game on. One scene is a slightly modified version of the TP2 scene with the addition of all the game elements and the other is a simple round table also with the objects necessary for the game. Change between scenes on the interface "Theme" folder.
  - [Scene Running](https://web.fe.up.pt/~up201806206/laig/TP3/)

### Main Strong Points
  - Multiple game modes, ability to choose what/who controls each of the two players. Choose between human, easy AI or hard AI.
  - Game mode/ player's controllers can be changed at any time.
  - Allows the setup of multiple types of views/cameras.
  - Camera rotates 180º if the next turn's player is human.
  - Piece movement is not linear.
  - When a piece is selected it begins a custom animation.
  - Selectable objects are updated depending on the state of the game.
  - Undo moves: Every move is saved on a stack so they can all be undone until the game reaches the starting point even if it has already ended. Only works normally when there is at least 1 human playing because it undoes moves until the human's turn. Can still work on AI vs AI but requires one controller to be changed, then the move(s) can be undome and then the controller must be changed back.
  - play a movie of all past moves. Can be played mid-game and the game will proceed normally after the end of the movie. Similarly to the undo functionality, while mid-game only works if there is at least one human player. If the game has already ended works either way.
  - Pause the game.
  - Start a new game without having to reload.
  - Timer on a human's player turn.
  - The games score is show at all times and is updated when necessary.
  - Game's elements like both types of pieces, both tipes of tiles and the holder of the pieces all have templates so it is easy to change the materials/textures or even primitive if needed. These templates are under a new section on the XML <templates> where you define the nodes that will represent the differents objects. What each template is for is defined after each "root" node of the template i.e. <node id="P2piece" type="P2">. Types are P1, P2, normal,void and holder. 
  - Allow multiple templates for each elements of the game. Change between templates on the interace's "Theme" folder
  - A bunch of new primitives so multiple elements can be drawn more than once and/or their position can be changed on the XML scene. For exemple: timers, messages, scores, board, option menu, etc.
  - An option menu can be drawn in the XML scene. All options on the scene menu will still be present on the interface.

### Important
  - One template of each type is required (P1, P2, normal,void and holder) for each scene file.
  - Some of the primitives are required to exist in the scene XML (board).
  - Game rules and other instructions on users_manual.pdf in the TP3 folder.

### Issues/Problems

- Using the controls on the interface that are shared with the scene option menu won't update the scene objects and vice-versa.


