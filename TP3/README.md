# LAIG 2020/2021 - TP3

## Group: T02G05

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Nuno Oliviera    | 201806525 | up201806525@fe.up.pt |
| Luís Pinto       | 201806206 | up201806206@fe.up.pt |

----
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

### Issues/Problems

- Using the controls on the interface that are shared with the scene option menu won't update the scene objects and vice-versa.
