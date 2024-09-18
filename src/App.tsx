import "./App.css";
import { createSignal } from "solid-js";
import embedDefault from "./assets/embed.html?raw";

function App() {
  const blob = new Blob([embedDefault], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  let embedString = embedDefault;
  let [embed, setEmbed] = createSignal(url);

  const fileInput = (_: Event) => {
    document.getElementById("file-input")?.click();
  };

  const onFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    const reader = new FileReader();

    if (file && file.type === "application/json") {
      reader.onload = () => {
        try {
          const startMarker = "//Leaderboard data start";
          const endMarker = "//Leaderbaord data end";
          const beforeStart = embedDefault.slice(
            0,
            embedDefault.indexOf(startMarker),
          );
          const afterEnd = embedDefault.slice(
            embedDefault.indexOf(endMarker) + endMarker.length,
          );
          const newHtml = `${beforeStart}window.data = ${reader.result as string};\n${afterEnd}`;

          embedString = newHtml;
          const blob = new Blob([embedString], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          setEmbed(url);
        } catch (e) {
          console.log("Failed to read file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const copyEmbed = (_: Event) => {
    try {
      navigator.clipboard.writeText(embedString);
    } catch {
      console.log("Failed to copy to clipboard");
    }
  };

  return (
    <div class="mx-auto max-w-4xl">
      <input
        id="file-input"
        type="file"
        accept="application/json"
        class="hidden"
        onchange={onFileChange}
      ></input>
      <button
        class="my-2 bg-sky-800 p-1 text-white active:bg-sky-900"
        onclick={fileInput}
      >
        Load leaderboard
      </button>
      <br />
      <button
        class="my-2 bg-sky-800 p-1 text-white active:bg-sky-900"
        onclick={copyEmbed}
      >
        Copy embed
      </button>
      <iframe class="h-screen w-full" src={embed()} />
    </div>
  );
}

export default App;
