import React, { useEffect, useState } from "react";

const ColorGenerator = () => {
    const [adjectives, setAdjectives] = useState([]);
    const [nouns, setNouns] = useState([]);
    const [imageData, setImageData] = useState(null);
    const canvasRef = React.useRef(null);

    const titleFont = "bold 40px Arial, sans-serif";
    const colorFont = "40px Arial, sans-serif";
    const descriptionFont = "40px Arial, sans-serif";

    // Add a vertical padding parameter to adjust the spacing inside the white bar
    const verticalPadding = 60; // You can adjust this value to your needs

    const capitalizeWord = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    useEffect(() => {
        const fetchJsonData = async (fileName, key, setFunction) => {
            try {
                const response = await fetch(`/${fileName}`);
                const data = await response.json();
                setFunction(data[key]); // Access the key to retrieve the array
                const capitalizedWords = data[key].map(capitalizeWord);
                setFunction(capitalizedWords);
            } catch (error) {
                console.error(`Failed to load ${fileName}:`, error);
            }
        };

        fetchJsonData("datasets/adjectives.json", "adjectives", setAdjectives);
        fetchJsonData("datasets/nouns.json", "nouns", setNouns);
    }, []);

    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    const generateHexColor = () =>
        `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase()}`;

    const generateStory = async () => {
        if (adjectives.length === 0 || nouns.length === 0) {
            alert("Adjective and noun lists are not loaded.");
            return;
        }

        const color = generateHexColor();
        const adjective = getRandomItem(adjectives);
        const noun = getRandomItem(nouns);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 1080;
        canvas.height = 1080;

        // Fill the background with the generated color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the white bar at the bottom
        const barHeight = 200;
        ctx.fillStyle = "white";
        ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

        // Ensure fonts are ready before rendering text
        await document.fonts.ready;

        // Text rendering logic
        ctx.fillStyle = "black";
        const textXStart = 20; // Left margin
        const textYStart = canvas.height - barHeight + verticalPadding; // Adjusted to account for verticalPadding

        // Draw title
        ctx.font = titleFont;
        ctx.textAlign = "left"; // Left align the text
        ctx.fillText("Color Stories", textXStart, textYStart);

        // Draw color hex code
        ctx.font = colorFont;
        ctx.fillText(color, textXStart, textYStart + 50);

        // Draw adjective and noun combination
        const description = `${adjective} ${noun}`;
        ctx.font = descriptionFont;
        ctx.fillText(description, textXStart, textYStart + 100);

        // Set the background image of the color box
        setImageData(canvas.toDataURL());
    };

    const saveImage = () => {
        const link = document.createElement("a");
        link.download = "ColorStories_output.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                margin: 0,
                padding: 0,
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    width: 1080,
                    height: 1080,
                    backgroundImage: `url(${imageData})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    margin: "20px 0",
                }}
            ></div>

            <button
                onClick={generateStory}
                style={{
                    padding: "10px 20px",
                    margin: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Generate New Story
            </button>
            <button
                onClick={saveImage}
                style={{
                    padding: "10px 20px",
                    margin: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Save as Image
            </button>

            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
};

export default ColorGenerator;
