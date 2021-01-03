//From https://github.com/EvanHahn/ScriptInclude
include = function() {
    function f() {
        var a = this.readyState;
        (!a || /ded|te/.test(a)) && (c--, !c && e && d())
    }
    var a = arguments,
        b = document,
        c = a.length,
        d = a[c - 1],
        e = d.call;
    e && c--;
    for (var g, h = 0; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function(a) {
    var b = console,
        c = serialInclude.l;
    if (a.length > 0) c.splice(0, 0, a);
    else b.log("Done!");
    if (c.length > 0) {
        if (c[0].length > 1) {
            var d = c[0].splice(0, 1);
            b.log("Loading " + d + "...");
            include(d, function() { serialInclude([]); });
        } else {
            var e = c[0][0];
            c.splice(0, 1);
            e.call();
        };
    } else b.log("Finished.");
};
serialInclude.l = new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'primitives/MyRectangle.js',
    'MyAxis.js', 'MyNode.js', 'primitives/MyTriangle.js', 'primitives/MyCylinder.js', "primitives/DisplayInterface.js", 'primitives/MySphere.js', 'primitives/MyTorus.js',
    'sprites_animations/KeyFrame.js', 'sprites_animations/Animation.js', 'sprites_animations/KeyFrameAnimation.js', 'sprites_animations/MySpritesheet.js',
    'sprites_animations/MySpriteText.js', 'sprites_animations/MySpriteAnimation.js', 'nurbs/Plane.js', 'nurbs/Patch.js',
    'nurbs/Defbarrel.js', 'primitives/MyHexagon.js', 'game/GameOrchestrator.js', 'game/Board.js', 'game/BoardTile.js', 'game/Piece.js',
    'game/GameMove.js', 'game/GameSequence.js', 'game/Animator.js', 'game/PrologInterface.js', 'game/Player.js', 'game/CollectZone.js', 'game/OptionsMenu.js',

    main = function() {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 



        var filenames = ["LAIG_TP2_T2_G05.xml", "1.xml", ];
        if (getUrlVars()['file'])
            filenames.push(getUrlVars()['file']);
        myInterface.setFilenames(filenames);

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        new MySceneGraph(filenames[0], myScene, true);

        // start
        app.run();
    }
]);