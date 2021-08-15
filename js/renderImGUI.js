

function renderImGUI() {
    ImGui.Begin("Settings");
    autoImgui(s_brushSize)
    autoImgui(s_brushOpacity)
    autoImgui(s_brushWeight)
    autoImgui(s_brushColor)
    autoImgui(s_brushAltColor)
    autoImgui(s_currentTool)

    ImGui.Separator()
    ImGui.Separator()

    autoImgui(s_renderScale)
    if (ImGui.Button("Render")) {
        bakeOnNextFrame = true;
    }
    ImGui.End();
    ImGui.Begin("Layers");
    ImGui.Text(`Test`);
    ImGui.End();
}


function autoImgui(q) {
    let type = typeof(q[0])
    if (type === "number") {
        if (Number.isInteger(q[0]) && Number.isInteger(q[2]) && Number.isInteger(q[3])) {
            ImGui.SliderInt(q[1], (_ = q[0]) => q[0] = _, q[2], q[3])
        } else {
            ImGui.SliderFloat(q[1], (_ = q[0]) => q[0] = _, q[2], q[3])
        }
    } else if (Array.isArray(q[0])) {
        let l = q[0].length
        if (l === 3) {
            ImGui.ColorEdit3(q[1], q[0]);
        } else {
            console.log("No auto imgui for arrays of length " + l)
        }
    } else if (type === "string") {
        if (Array.isArray(q[2])) {
            for (let t of q[2]) {
                if (ImGui.RadioButton(t, t === q[0])) {
                    q[0] = t;
                }
                if (t !== q[2][q[2].length - 1]) {
                    ImGui.SameLine();
                }
            }
        } else {
            console.log("No auto imgui for non-radio button strings")
        }
    } else {
        console.log("No auto imgui for " + type)
    }
}
