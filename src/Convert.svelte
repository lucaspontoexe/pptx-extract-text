<script lang="ts">
    import uzip from "uzip";

    let finalText = "";

    type states = "idle" | "dragging" | "dropped";
    let state: states = "idle";

    const dp = new DOMParser();
    const utf8decoder = new TextDecoder();

    function parseXML(input: string) {
        function getLineText(node: HTMLParagraphElement) {
            const words = node.childNodes;
            let finalText = "";

            words.forEach(
                (
                    element: Element & { tagName: string; textContent: string }
                ) => {
                    // if (element.tagName === "a:r") finalText += element.textContent;
                    // else
                    if (element.tagName === "a:br") finalText += "\n";
                    else finalText += element.textContent;
                }
            );
            return finalText;
        }

        let lineBreakCount = 0;

        let output = "";
        const xmldoc = dp.parseFromString(input, "text/xml");
        xmldoc.querySelectorAll("p").forEach((entry) => {
            const text = getLineText(entry).trim() + "\n";
            if (text === "\n") lineBreakCount++;
            else lineBreakCount = 0;

            if (lineBreakCount < 2) output += text;
        });
        return output;
    }

    function handleInputFile(e: Event) {
        const file = (e.target as HTMLInputElement).files[0];
        state = "dropped";
        loadFile(file);
    }

    async function loadFile(file: File) {
        if (!file) {
            state = "idle";
            return;
        }

        finalText = "";
        state = "dropped";

        const files = uzip.parse(await file.arrayBuffer());

        const howManyFiles = Object.keys(files).filter(
            (entry) => entry.indexOf("ppt/slides/slide") !== -1
        ).length;

        for (let index = 1; index <= howManyFiles; index++) {
            const buffer = files["ppt/slides/slide" + index + ".xml"];
            const content = utf8decoder.decode(buffer);
            finalText += parseXML(content);
        }
    }
</script>

<style>
    main {
        position: absolute;
        left: 5vw;
        top: 5vh;
        width: 90%;
        height: 90%;
        border-radius: 10px;
        text-align: center;
        border: 4px dotted rgb(184, 184, 184);
        background-color: rgba(143, 143, 143, 0.39);
        z-index: 1;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        transition: background-color 200ms, border 200ms, opacity 200ms;
    }
    main.dragging {
        border: 4px dotted rgb(235, 185, 76);
        background-color: rgba(238, 205, 20, 0.6);
    }

    main.dropped {
        opacity: 0;
        z-index: -1;
    }

    .post-select {
        opacity: 0;
        transition: opacity 200ms;
    }
    .post-select.dropped {
        opacity: 1;
    }
</style>

<main
    class={state}
    on:dragover|preventDefault={() => (state = 'dragging')}
    on:dragleave|preventDefault={() => (state = 'idle')}
    on:drop|preventDefault={(e) => loadFile(e.dataTransfer.files[0])}>
    <h1>PPTX to TXT</h1>

    <div class="text">
        {state === 'dragging' ? 'Solte' : 'Arraste'}
        um arquivo .pptx para converter em texto.
    </div>

    <input type="file" on:change={handleInputFile} accept=".pptx" />
</main>

<section
    class="post-select {state}"
    on:dragover|preventDefault={() => (state = 'dragging')}>
    <h2>Texto extraído</h2>
    <p>Arraste ou selecione outro arquivo para converter</p>

    <input type="file" on:change={handleInputFile} accept=".pptx" />
    <hr />

    <pre>{finalText}</pre>
</section>
