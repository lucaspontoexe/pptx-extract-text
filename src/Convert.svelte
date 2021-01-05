<script lang="ts">
    import {loadAsync} from "jszip";
    const dp = new DOMParser();
    let finalText = "";
    export let name = "vamo lá";

    async function handleLoad(e: Event) {
        const file = (e.target as HTMLInputElement).files[0];

        const zip = await loadAsync(file);
        zip.filter((path) => path.indexOf("ppt/slides/slide") !== -1).forEach(
            async (file) => {
                const fileContent = await file.async("string");
                finalText += parseXML(fileContent);
            }
        );
    }

    function parseXML(input: string) {
        let output = "";
        const xmldoc = dp.parseFromString(input, "text/xml");
        xmldoc.querySelectorAll("p").forEach((entry) => {
            output += entry.textContent.trim() + "\n";
        });
        return output;
    }
</script>

<main>
    <input type="file" accept=".pptx" on:change={handleLoad} />

    fun fact: a prop <em>name</em> é {name}

    <br />
    <hr />
    <pre>
        {finalText}
    </pre>
</main>
