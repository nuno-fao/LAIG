# LAIG 2020/2021 - TP1

## Group T02G05
| Name                      | Number    | E-Mail               |
| ------------------------- | --------- | ------------------   |
| Luís Miguel Pinto         | 201806206 | up201806206@fe.up.pt |
| Nuno Oliveira             | 201806525 | up201806525@fe.up.pt |

----
## Project information

### Scene
  - The scene we created is a simple outdoor dinning table with an orange, a donut, a napkin, a can of coke and 6 chairs
  - There are also 2 floors, a wall, a BBQ stand and a lamp (with its own light source) to light up the table
  - [Scene Running](https://web.fe.up.pt/~up201806206/laig/TP1/)
  - [Scene XML](./scenes/envio.xml)

### Main Strong Points
  - All primitives have been implemented
  - Heritage working properly for both materials and textures
  - Texture amplification working aswell
  - Each node applies "clear" material properly if needed and applies our own default material
  - Transformations all work as they should
  - GUI implemented with a dropdown for cameras, a folder with checkboxes for each light and another checkbox to visualize every light source

### Additional features
  - Vectors have default values for each element and a warning is produced in case of any error or missing value. Examples: RGBA, Transformations, Lights and each of its components, Cameras, Afs and Aft, Ambient and Background
  - Materials, Textures, Transformations, Amplification and Descendants can be omitted and produce a warning
  - Maximum number of lights accepted is 8 and minimum is 0 (everything will be very dark obviously)
  - There is a default camera that is used if none is declared on the XML
  - If no root is declared according to this project's syntax we will try to find a node without any parent and use it as root. Of course this may not allways work properly if there are more than 1 node with no parent. If none is found we will simply use the first one
  - Created and unreferenced nodes are indentified and produce a warning
----
## Issues/Problems

- All features have been implemented and we found no bugs or problems within our code
