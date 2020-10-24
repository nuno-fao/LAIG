const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
let INITIALS_INDEX = 0;
let VIEWS_INDEX = 1;
let ILLUMINATION_INDEX = 2;
let LIGHTS_INDEX = 3;
let TEXTURES_INDEX = 4;
let MATERIALS_INDEX = 5;
let NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.rootNode = null;
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        let rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        let error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        let nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        let nodeNames = [];
        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let error;
        // Processes each node, verifying errors.

        // <initials>
        let index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block40
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        let children = initialsNode.children;
        let nodeNames = [];

        for (let i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        let rootIndex = nodeNames.indexOf("root");
        let referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            this.onXMLError("No root tag defined for scene.");

        let rootNode = children[rootIndex];

        let id = this.reader.getString(rootNode, 'id', false);
        if (id == null)
            this.onXMLError("No root id defined for scene.");

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        let refNode = children[referenceIndex];
        let axis_length = this.graphGetFloat(refNode, 'length', false);
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.views = [];
        let cameras = viewsNode.children;

        //check if there was any camera defined
        if (cameras.length <= 0) {
            this.onXMLError("The Xml does not define any camera, using Default Camera");
        }

        let defaultCamera = this.reader.getString(viewsNode, "default", false);
        if (defaultCamera == null) {
            this.onXMLError("No default camera set, using first camera on the XML file as default");
        }

        for (let i = 0; i < cameras.length; i++) {
            let cameraID = this.reader.getString(cameras[i], "id", false);
            if (cameraID == null) {
                this.onXMLError("There is one camera without a defined id, ignoring that camera (camera number " + (i + 1) + ")");
                continue;
            }
            if (this.views[cameraID] != null) {
                this.onXMLError("ID must be unique for each camera (conflict: ID = " + cameraID + "), using only the first camera with this id");
                continue;
            }
            let near = this.graphGetFloat(cameras[i], 'near', false)
            let far = this.graphGetFloat(cameras[i], 'far', false)
            if (near == null) {
                near = 0.1;
                this.onXMLMinorError("Camera '" + cameraID + "near value not defined, set to -0.1")
            }
            if (far == null) {
                far = 400
                this.onXMLMinorError("Camera '" + cameraID + "far value not defined, set to 400")
            }
            let position;
            let target;
            let up;
            let cameraAtributes = viewsNode.children[i].children;

            //atribui cada atributo à respetiva variável 
            for (let u = 0; u < cameraAtributes.length; u++) {
                if (cameraAtributes[u].nodeName == "from") {
                    position = this.parseCoordinates3D(cameraAtributes[u], "view position error");
                    position.push(0);
                }
                if (cameraAtributes[u].nodeName == "to") {
                    target = this.parseCoordinates3D(cameraAtributes[u], "view target error");
                    target.push(0);
                }
                if (cameraAtributes[u].nodeName == "up") {
                    up = this.parseCoordinates3D(cameraAtributes[u], "view direction error");
                    up.push(0);
                }
            }
            //checks if it is a perspective or ortho camera(they have different Class builders)
            if (cameras[i].nodeName == "perspective") {
                let angle = this.graphGetFloat(cameras[i], 'angle', false);
                if (angle == null) {
                    angle = 45;
                    this.onXMLMinorError("Camera '" + cameraID + "angle value not defined, set to 45")
                }
                //converte angulo de graus para radianos
                angle = angle / 180.0 * 3.1415
                this.views[cameraID] = new CGFcamera(angle, near, far, position, target);

            } else if (cameras[i].nodeName == "ortho") {
                let left = this.graphGetFloat(cameras[i], 'left', false)
                let right = this.graphGetFloat(cameras[i], 'right', false)
                let top = this.graphGetFloat(cameras[i], 'top', false)
                let bottom = this.graphGetFloat(cameras[i], 'bottom', false)

                if (left == null) {
                    left = -5;
                    this.onXMLMinorError("Camera '" + cameraID + "left value not defined, set to -5")
                }
                if (right == null) {
                    right = 5;
                    this.onXMLMinorError("Camera '" + cameraID + "right value not defined, set to 5")
                }
                if (bottom == null) {
                    bottom = -5;
                    this.onXMLMinorError("Camera '" + cameraID + "bottom value not defined, set to -5")
                }
                if (top == null) {
                    top = 5;
                    this.onXMLMinorError("Camera '" + cameraID + "top value not defined, set to 5")
                }

                this.views[cameraID] = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
            }
            //guarda o id da camera na estrutura de dados do CFG
            this.views[cameraID].cameraId = cameraID;
        }
        if (this.views[defaultCamera] == null) {
            this.scene.defaultCamera = null;
            this.onXMLMinorError("Camera '" + defaultCamera + "' was not defined, using the fist camera on the XML as default");
        } else
            this.scene.defaultCamera = defaultCamera;

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        let illuminationAtributes = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        let nodeNames = [];

        for (let i = 0; i < illuminationAtributes.length; i++)
            nodeNames.push(illuminationAtributes[i].nodeName);

        let ambientIndex = nodeNames.indexOf("ambient");
        let backgroundIndex = nodeNames.indexOf("background");

        let color;
        if (ambientIndex < 0) {
            this.onXMLMinorError("Ambient color not defined");
            color = [0.2, 0.2, 0.2, 1]
        } else {
            color = this.parseColor(illuminationAtributes[ambientIndex], "ambient");
        }
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        //check if backgroudcolor was defined,if not use a default values
        if (backgroundIndex < 0) {
            this.onXMLMinorError("Background color not defined");
            color = [1, 1, 1, 1]
        } else
            color = this.parseColor(illuminationAtributes[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        let lightsList = lightsNode.children;

        this.lights = [];
        let numLights = 0;

        let lightAtributes = [];
        let nodeNames = [];

        if (lightsList.length > 8) {
            this.onXMLMinorError("Maximum number of lights is 8, tried to use " + lightsList.length + ".")
        }
        for (let i = 0; i < lightsList.length && i < 8; i++) {

            // Storing light information
            let global = [];
            let attributeNames = [];
            let attributeTypes = [];

            //Check type of light
            if (lightsList[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + lightsList[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            let lightId = this.reader.getString(lightsList[i], 'id', false);
            if (lightId == null) {
                this.onXMLError("There is one light without a defined id, ignoring that light (light number " + (i + 1) + ")");
                continue;
            }

            // Checks for repeated IDs.
            if (this.lights[lightId] != null) {
                this.onXMLError("ID must be unique for each light (conflict: ID = " + lightId + "), using only the first light with this id");
                continue;
            }

            lightAtributes = lightsList[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (let j = 0; j < lightAtributes.length; j++) {
                nodeNames.push(lightAtributes[j].nodeName);
            }

            //
            for (let j = 0; j < attributeNames.length; j++) {
                let attributeIndex = nodeNames.indexOf(attributeNames[j]);
                let aux = 0;

                if (attributeIndex < 0 && attributeNames[j] == "enable") { // check if atribute was not found and if the error is on enable, if it is, false value will be used
                    global.push(false);
                    this.onXMLMinorError("Enable value for light '" + lightId + "' was not set, used default value 0")
                } else if (attributeIndex > -1) { // check if the atribute was found
                    if (attributeTypes[j] == "boolean")
                        aux = this.parseBoolean(lightAtributes[attributeIndex], "value", "for light " + lightId);
                    else if (attributeTypes[j] == "position") {
                        aux = this.parseCoordinates4D(lightAtributes[attributeIndex], "Value not Defined; " + lightId);
                    } else
                        aux = this.parseColor(lightAtributes[attributeIndex], attributeNames[j] + "Value not Defined; " + lightId);

                    if (typeof aux === 'string') {
                        this.onXMLMinorError(aux);
                    }
                    global.push(aux);
                } else { //if the atribute was not found and the error is not on the enable value, a default light will be used with the enable remaining the one on the xml
                    let enable = global[0];
                    this.onXMLError("The light '" + lightId + "' is not well defined, a default light will be used and 'enable' will be set to " + enable);
                    global = [];

                    global.push(enable); // enable value is set
                    global.push([10, 10, 10, 1]); //position
                    global.push([1, 1, 1, 1]); //ambient
                    global.push([1, 1, 1, 1]); //diffuse
                    global.push([1, 1, 1, 1]); //specular
                    break;
                }
            }

            global.push(lightId);
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            this.onXMLError("At least one light should be defined");
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        let textures = texturesNode.children;
        this.textures = [];
        for (let i = 0; i < textures.length; i++) {
            let textureID = this.reader.getString(textures[i], "id", false);
            let path = this.reader.getString(textures[i], "path", false)

            // check if texture and path are valid
            if (textureID == null) {
                this.onXMLError("There is one texture without a defined id, ignoring that texture (texture number " + (i + 1) + ")");
                continue;
            } else if (path == null) {
                this.onXMLError("Path not defined for node '" + textureID + "'");
                continue;
            }
            // Checks for repeated IDs.
            if (this.textures[textureID] != null) {
                this.onXMLError("ID must be unique for each texture (conflict: ID = " + textureID + "), using only the first texture with this id");
                continue;
            }

            let exists = this.checkFileExist(path);

            //if the texture was not found, the texture will be set to 'clear'
            if (exists == true) {
                this.textures[textureID] = new CGFtexture(this.scene, path);
            } else {
                this.textures[textureID] = "clear";
                this.onXMLMinorError("texture file not found, the texture will be set to 'clear'")
            }
        }
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let materialsList = materialsNode.children;

        this.materials = [];

        let materialAtribute = [];
        let nodeNames = [];

        // Any number of materials.
        for (let i = 0; i < materialsList.length; i++) {

            if (materialsList[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + materialsList[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            let materialID = this.reader.getString(materialsList[i], 'id', false);
            if (materialID == null) {
                this.onXMLError("no ID defined for material number " + i + ", ignoring material");
                continue;
            }

            // Checks for repeated IDs.
            if (this.materials[materialID] != null) {
                this.onXMLError("ID must be unique for each material (conflict: ID = " + materialID + "), only using first material with that id");
                continue;
            }

            //parse material atributes
            let materialAtribute = materialsList[i].children;
            this.materials[materialID] = new CGFappearance(this.scene);
            for (let u = 0; u < materialAtribute.length; u++) {
                let color;

                if (materialAtribute[u].nodeName == "ambient") {
                    color = this.parseColor(materialAtribute[u], "Color ERROR");
                    this.materials[materialID].setAmbient(color[0], color[1], color[2], color[3]);
                } else if (materialAtribute[u].nodeName == "diffuse") {
                    color = this.parseColor(materialAtribute[u], "Color ERROR");
                    this.materials[materialID].setDiffuse(color[0], color[1], color[2], color[3]);
                } else if (materialAtribute[u].nodeName == "specular") {
                    color = this.parseColor(materialAtribute[u], "Color ERROR");
                    this.materials[materialID].setSpecular(color[0], color[1], color[2], color[3]);
                } else if (materialAtribute[u].nodeName == "emissive") {
                    color = this.parseColor(materialAtribute[u], "Color ERROR");
                    this.materials[materialID].setEmission(color[0], color[1], color[2], color[3]);
                } else if (materialAtribute[u].nodeName == "shininess") {
                    let sh = this.graphGetFloat(materialAtribute[u], "value", false);
                    if (sh == null) {
                        this.onXMLMinorError("Shininess value of material '" + materialID + "' is not defined")
                    }
                    this.materials[materialID].setShininess();

                }
            }
        }
        this.scene.materialStack.push(this.scene.defaultMaterial);
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        let nodesList = nodesNode.children;

        let nodeAtributes = [];
        let nodeNames = [];
        let descendants = [];

        //percorre os nodes e cria as estruturas de dados
        for (let i = 0; i < nodesList.length; i++) {

            if (nodesList[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + nodesList[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            let nodeID = this.reader.getString(nodesList[i], 'id', false);
            if (nodeID == null) {
                this.onXMLError("no ID defined for nodeID number " + i + ", ignoring ");
                continue;
            }

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null) {
                this.onXMLError("ID must be unique for each node (conflict: ID = " + nodeID + "), using only first node with that id");
                continue;
            }

            nodeAtributes = nodesList[i].children;

            nodeNames = [];
            for (let j = 0; j < nodeAtributes.length; j++) {
                nodeNames.push(nodeAtributes[j].nodeName);
            }

            let transformationsIndex = nodeNames.indexOf("transformations");
            let materialIndex = nodeNames.indexOf("material");
            let textureIndex = nodeNames.indexOf("texture");
            descendants[nodeID] = nodeNames.indexOf("descendants");

            let transformation_matrix;
            if (transformationsIndex < 0) {
                this.onXMLMinorError("Transformation block for '" + nodeID + "' not found!")
                transformation_matrix = null;
            } else {
                transformation_matrix = nodesList[i].children[transformationsIndex];
            }
            let texture;
            if (textureIndex < 0) {
                this.onXMLMinorError("Texture block for '" + nodeID + "' not found, using 'null' value");
                texture = null;
            } else {
                texture = nodesList[i].children[textureIndex];
            }
            let material;
            if (materialIndex < 0) {
                this.onXMLMinorError("Material block for '" + nodeID + "' not found, using 'null' value")
                material = null;
            } else {
                material = nodesList[i].children[materialIndex];
            }
            this.nodes[nodeID] = new MyNode(
                this.scene,
                transformation_matrix,
                texture,
                material
            );
            descendants[nodeID] = nodesList[i].children[descendants[nodeID]]
        }

        // popula estruturas de dados com dados do xml
        for (let nodeID in this.nodes) {

            if (this.nodes[nodeID].material != null) {
                let matID = this.reader.getString(this.nodes[nodeID].material, "id", false);
                if (matID == null) {
                    this.onXMLMinorError("Material id for node " + nodeID + " is not set, using value null")
                }
                if (matID != "null") {
                    this.nodes[nodeID].material = this.materials[matID];
                    if (this.nodes[nodeID].material == null) {
                        this.onXMLMinorError("MaterialId (" + matID + ") on node '" + nodeID + "' does not reference a valid material")
                    }
                } else {
                    this.nodes[nodeID].material = null;
                }
            }


            //parse texture
            let afs, aft;
            if (this.nodes[nodeID].texture != null) {
                afs = this.reader.getString(this.nodes[nodeID].texture.children[0], "afs", false);
                aft = this.reader.getString(this.nodes[nodeID].texture.children[0], "aft", false);

                let textureID = this.reader.getString(this.nodes[nodeID].texture, "id", false);
                if (textureID == "clear") {
                    this.nodes[nodeID].texture = "clear";
                } else if (textureID == null) {
                    this.onXMLMinorError("Texture id for node " + nodeID + " is not set, using value null");
                    this.nodes[nodeID].texture = null;
                } else if (textureID != "null") {
                    let texture = this.textures[textureID];
                    this.nodes[nodeID].texture = texture;
                    if (texture == null) {
                        this.onXMLMinorError("TextureId (" + textureID + ") on node '" + nodeID + "' does not reference a valid texture")
                    }
                } else {
                    this.nodes[nodeID].texture = null;
                }
            }

            if (this.nodes[nodeID].texture != "clear") {
                if (afs == null) {
                    afs = 1;
                    this.onXMLMinorError("Afs info is missing for the node '" + nodeID + "', setting to 1")
                }
                if (aft == null) {
                    aft = 1;
                    this.onXMLMinorError("Aft info is missing for the node '" + nodeID + "', setting to 1")
                }
            }

            let descendantLength;
            if (descendants[nodeID] == -1 || descendants[nodeID] == null) {
                descendantLength = 0;
                this.onXMLError(nodeID + " does not have a descendants tag, some nodes may not be used");
            } else {
                descendantLength = descendants[nodeID].children.length;
            }

            //add descendants to each node, handles erros such as noderef thar don't exist
            for (let j = 0; j < descendantLength; j++) {
                let descendantList = descendants[nodeID].children[j];
                if (descendantList.nodeName == "noderef") {
                    let id = this.reader.getString(descendantList, 'id', false);
                    if (id == null) {
                        this.onXMLError("Node '" + nodeID + "' has a noderef without an id value");
                        continue;
                    }
                    let node = this.nodes[id];
                    if (node == null) {;
                        this.onXMLError("Node '" + id + "' referenced but not created!");
                        continue;
                    }
                    if (id == this.idRoot) {
                        this.onXMLError(this.idRoot + " is defined as root node, however it has parent nodes such as '" + nodeID + "', every node that is not a descendant of this node may not be rendered")
                    }
                    this.nodes[nodeID].addDescendente(node);
                    node.used = true;
                } else {
                    this.auxiliaryParseLeaf(descendantList, nodeID, afs, aft);
                }
            }

            this.scene.loadIdentity();

            if (this.nodes[nodeID].tg_matrix != null) {
                for (let j = 0; j < this.nodes[nodeID].tg_matrix.children.length; j++) {
                    let descendantList = this.nodes[nodeID].tg_matrix.children[j];

                    //parse transformation
                    switch (descendantList.nodeName) {
                        case "translation":
                            {
                                let position = this.parseCoordinates3D(descendantList, "");
                                this.scene.translate(position[0], position[1], position[2]);

                                break;
                            }
                        case "rotation":
                            {
                                let axis = this.reader.getString(descendantList, "axis", false);
                                let angle = this.graphGetFloat(descendantList, "angle", false);

                                if (axis == null) {
                                    this.onXMLError("Axis Value not set on rotation's block at node '" + nodeID + "'")
                                    break;
                                }
                                if (angle == null) {
                                    this.onXMLError("Angle Value not set on rotation's block at node '" + nodeID + "'")
                                    break;
                                }
                                angle = angle / 180 * Math.PI;
                                switch (axis) {
                                    case "x":
                                        {
                                            this.scene.rotate(angle, 1, 0, 0);
                                            break;
                                        }
                                    case "y":
                                        {
                                            this.scene.rotate(angle, 0, 1, 0);
                                            break;
                                        }
                                    case "z":
                                        {
                                            this.scene.rotate(angle, 0, 0, 1);
                                            break;
                                        }
                                    case "xx":
                                        {
                                            this.scene.rotate(angle, 1, 0, 0);
                                            break;
                                        }
                                    case "yy":
                                        {
                                            this.scene.rotate(angle, 0, 1, 0);
                                            break;
                                        }
                                    case "zz":
                                        {
                                            this.scene.rotate(angle, 0, 0, 1);
                                            break;
                                        }
                                    default:
                                        this.onXMLError("Axis Value for rotation on node '" + nodeID + "' not valid")

                                }
                                break;
                            }
                        case "scale":
                            {
                                let sx = this.graphGetFloat(descendantList, "sx", false);
                                let sy = this.graphGetFloat(descendantList, "sy", false);
                                let sz = this.graphGetFloat(descendantList, "sz", false);
                                if (sx == null) {
                                    this.onXMLMinorError("sx Value not set for scale on node '" + nodeID + "',using sx=1")
                                    sx = 1;
                                }
                                if (sy == null) {
                                    this.onXMLMinorError("sy Value not set for scale on node '" + nodeID + "',using sy=1")
                                    sy = 1;
                                }
                                if (sz == null) {
                                    this.onXMLMinorError("sz Value not set for scale on node '" + nodeID + "',using sz=1")
                                    sz = 1;
                                }

                                this.scene.scale(sx, sy, sz);

                                break;
                            }
                        default:
                            this.onXMLError("Transformation tag '" + descendantList.nodeName + "' not valid on node '" + nodeID + "'")

                    }
                }
            }
            this.nodes[nodeID].tg_matrix = this.scene.getMatrix();
        }

        // print which nodes were created but not used
        for (let nodeID in this.nodes) {
            if (this.nodes[nodeID].used == false && nodeID != this.idRoot) {
                this.onXMLError("Node '" + nodeID + "' created but not referenced!")
            }
        }

        //if root was not defined, it tries to find a node without any parent and make it root
        let rootNodeInstance = this.nodes[this.idRoot];
        if (rootNodeInstance == null) {
            let IdRootNodeInfered;
            let dictLenght = false;
            for (let nodeID in this.nodes) {
                dictLenght = true;
                if (this.nodes[nodeID].used == false) {
                    rootNodeInstance = this.nodes[nodeID];
                    IdRootNodeInfered = nodeID;
                    break;
                }
            }
            if (rootNodeInstance == null) {
                for (let nodeID in this.nodes) {
                    rootNodeInstance = this.nodes[nodeID];
                    IdRootNodeInfered = nodeID;
                    break;
                }
            }
            if (dictLenght)
                this.onXMLError("Root node '" + this.idRoot + "' does not exist, using '" + IdRootNodeInfered + "' as root")
            else
                this.onXMLError("There were no nodes created")

        }
        this.rootNode = rootNodeInstance;
    }

    /**
     * Create the leafs instances
     * @param {block element} leaf
     * @param {id of the leaf} nodeID
     * @param {amplification value for s} afs
     * @param {amplification value for t} aft
     */
    auxiliaryParseLeaf(leaf, nodeID, afs, aft) {
        switch (this.reader.getString(leaf, 'type', false)) {
            case "triangle":
                {
                    let x1 = this.graphGetFloat(leaf, 'x1', false);
                    if (x1 == null) {
                        this.onXMLMinorError("x1 value not set for triangle on node " + nodeID + ", using value 0")
                        x1 = 0
                    }

                    let x2 = this.graphGetFloat(leaf, 'x2', false);
                    if (x2 == null) {
                        this.onXMLMinorError("x2 value not set for triangle on node " + nodeID + ", using value 0")
                        x2 = 0
                    }

                    let x3 = this.graphGetFloat(leaf, 'x3', false);
                    if (x3 == null) {
                        this.onXMLMinorError("x3 value not set for triangle on node " + nodeID + ", using value 0")
                        x3 = 0
                    }

                    let y1 = this.graphGetFloat(leaf, 'y1', false);
                    if (y1 == null) {
                        this.onXMLMinorError("y1 value not set for triangle on node " + nodeID + ", using value 0")
                        y1 = 0
                    }

                    let y2 = this.graphGetFloat(leaf, 'y2', false);
                    if (y2 == null) {
                        this.onXMLMinorError("y2 value not set for triangle on node " + nodeID + ", using value 0")
                        y2 = 0
                    }

                    let y3 = this.graphGetFloat(leaf, 'y3', false);
                    if (y3 == null) {
                        this.onXMLMinorError("y3 value not set for triangle on node " + nodeID + ", using value 0")
                        y3 = 0
                    }

                    let t = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, afs, aft);
                    this.nodes[nodeID].addDescendente(t);
                    break;

                }
            case "rectangle":
                {
                    let x1 = this.graphGetFloat(leaf, 'x1', false);
                    if (x1 == null) {
                        this.onXMLMinorError("x1 value not set for rectangle on node " + nodeID + ", using value 0")
                        x1 = 0
                    }

                    let x2 = this.graphGetFloat(leaf, 'x2', false);
                    if (x2 == null) {
                        this.onXMLMinorError("x2 value not set for rectangle on node " + nodeID + ", using value 0")
                        x2 = 0
                    }

                    let y1 = this.graphGetFloat(leaf, 'y1', false);
                    if (y1 == null) {
                        this.onXMLMinorError("y1 value not set for rectangle on node " + nodeID + ", using value 0")
                        y1 = 0
                    }

                    let y2 = this.graphGetFloat(leaf, 'y2', false);
                    if (y2 == null) {
                        this.onXMLMinorError("y2 value not set for rectangle on node " + nodeID + ", using value 0")
                        y2 = 0
                    }

                    let r = new MyRectangle(this.scene, x1, y1, x2, y2, afs, aft);
                    this.nodes[nodeID].addDescendente(r);
                    break;
                }
            case "cylinder":
                {
                    let height = this.graphGetFloat(leaf, 'height', false);
                    if (height == null) {
                        this.onXMLMinorError("height value not set for cylinder on node " + nodeID + ", using value 1")
                        height = 1
                    }
                    let topRadius = this.graphGetFloat(leaf, 'topRadius', false);
                    if (topRadius == null) {
                        this.onXMLMinorError("topRadius value not set for cylinder on node " + nodeID + ", using value 1")
                        topRadius = 1
                    }
                    let bottomRadius = this.graphGetFloat(leaf, 'bottomRadius', false);
                    if (bottomRadius == null) {
                        this.onXMLMinorError("bottomRadius value not set for cylinder on node " + nodeID + ", using value 1")
                        bottomRadius = 1
                    }
                    let stacks = this.graphGetFloat(leaf, 'stacks', false);
                    if (stacks == null) {
                        this.onXMLMinorError("stacks value not set for cylinder on node " + nodeID + ", using value 30")
                        stacks = 30
                    }
                    let slices = this.graphGetFloat(leaf, 'slices', false);
                    if (slices == null) {
                        this.onXMLMinorError("slices value not set for cylinder on node " + nodeID + ", using value 30")
                        slices = 30
                    }
                    this.nodes[nodeID].addDescendente(new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks));
                    break;
                }
            case "sphere":
                {
                    let radius = this.graphGetFloat(leaf, 'radius', false);
                    if (radius == null) {
                        this.onXMLMinorError("radius value not set for sphere on node " + nodeID + ", using value 1")
                        radius = 1
                    }
                    let stacks = this.graphGetFloat(leaf, 'stacks', false);
                    if (stacks == null) {
                        this.onXMLMinorError("stacks value not set for sphere on node " + nodeID + ", using value 30")
                        stacks = 30
                    }
                    let slices = this.graphGetFloat(leaf, 'slices', false);
                    if (slices == null) {
                        this.onXMLMinorError("slices value not set for sphere on node " + nodeID + ", using value 30")
                        slices = 30
                    }
                    this.nodes[nodeID].addDescendente(new MySphere(this.scene, radius, slices, stacks));
                    break;
                }
            case "torus":
                {
                    let inner = this.graphGetFloat(leaf, 'inner', false);
                    if (inner == null) {
                        this.onXMLMinorError("inner value not set for torus on node " + nodeID + ", using value 0.1")
                        inner = 0.1
                    }
                    let outer = this.graphGetFloat(leaf, 'outer', false);
                    if (outer == null) {
                        this.onXMLMinorError("outer value not set for torus on node " + nodeID + ", using value 1")
                        outer = 1
                    }
                    let slices = this.graphGetFloat(leaf, 'slices', false);
                    if (slices == null) {
                        this.onXMLMinorError("outer value not set for torus on node " + nodeID + ", using value 30")
                        slices = 30
                    }
                    let loops = this.graphGetFloat(leaf, 'loops', false);
                    if (loops == null) {
                        this.onXMLMinorError("loops value not set for torus on node " + nodeID + ", using value 30")
                        loops = 30
                    }
                    this.nodes[nodeID].addDescendente(new MyTorus(this.scene, inner, outer, slices, loops));
                }
        }
    }

    /**
     * Parse a boolean with id = name
     * @param {block element} node
     * @param {name of the elemnt to be retrieved} name
     * @param {message to be displayed in case of error} messageError
     */
    parseBoolean(node, name, messageError) {
        let boolVal = this.reader.getBoolean(node, name, false);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError(
                "unable to parse value component " +
                messageError +
                "; assuming 'value = 1'"
            );
            return true;
        }


        return boolVal;

    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        let position = [];

        // x
        let x = this.graphGetFloat(node, 'x');
        if (x == null) {
            x = 0;
            this.onXMLError(messageError + " 'x' value set to 0");
        }
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        let y;
        y = this.graphGetFloat(node, 'y', false);
        if (y == null) {
            y = 0;
            this.onXMLError(messageError + " 'y' value set to 0");
        }

        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        let z = this.graphGetFloat(node, 'z', false);
        if (z == null) {
            z = 0;
            this.onXMLError(messageError + " 'z' value set to 0");
        }
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        let position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        let w = this.graphGetFloat(node, 'w', false);
        if (w == null) {
            w = 0;
            this.onXMLError(messageError + " 'w' value set to 0");
        }
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        let color = [];

        // R
        let r = this.graphGetFloat(node, 'r', false);
        if (r == null) {
            r = 0;
            this.onXMLError(messageError + " 'r' value set to 0");
        }
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        let g = this.graphGetFloat(node, 'g', false);
        if (g == null) {
            g = 0;
            this.onXMLError(messageError + " 'g' value set to 0");
        }
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        let b = this.graphGetFloat(node, 'b', false);
        if (b == null) {
            b = 0;
            this.onXMLError(messageError + " 'b' value set to 0");
        }
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        let a = this.graphGetFloat(node, 'a', false);
        if (a == null) {
            a = 0;
            this.onXMLError(messageError + " 'a' value set to 0");
        }
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.rootNode.display();
    }

    /**
     * Check if a file exists on the server
     * @param {url of the file to check} url
     */
    checkFileExist(url) {
        let http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status == 200) {
            return true;
        } else {
            this.onXMLMinorError("File '" + url + "' doesn't exists");
            return false
        }
    }

    /**
     * Get a float value from the xml
     * @param {block element} tag
     * @param {string name of the xml elemnt to retrieve} ustringrl
     */
    graphGetFloat(tag, string) {
        let out = this.reader.getFloat(tag, string, false);
        if (isNaN(out)) {
            this.onXMLMinorError("Value '" + string + "' on node " + tag.parentNode.nodeName + "." + tag.nodeName + " is not valid (tag: " + tag.outerHTML + "),ignoring this block")
        }
        return out
    }
}