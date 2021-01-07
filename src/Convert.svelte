<script lang="ts">
    import uzip from "uzip";

    export let name = "vamo lá";

    let finalText = "ih caramba";

    type states = "idle" | "isDragging" | "dropped";
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

        let output = "";
        const xmldoc = dp.parseFromString(input, "text/xml");
        xmldoc.querySelectorAll("p").forEach((entry) => {
            output += getLineText(entry).trim() + "\n";
        });
        return output;
    }

    function handleInputFile(e: Event) {
        const file = (e.target as HTMLInputElement).files[0];
        loadFile(file);
    }

    async function loadFile(file: File) {
        finalText = "";

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

<h1>PPTX to TXT</h1>
<p>o name é {name}</p>

<div class="drop-target">
    <div
        class="text"
        on:dragover|preventDefault={() => (state = 'isDragging')}
        on:drop|preventDefault={(e) => {
            loadFile(e.dataTransfer.files[0]);
            state = 'dropped';
        }}>
        {state === 'isDragging' ? 'Solte' : 'Arraste'}
        um arquivo .pptx para converter em texto.
    </div>
    <input type="file" on:change={handleInputFile} accept=".pptx" />
</div>

<hr /><br />
<pre>{finalText}</pre>
