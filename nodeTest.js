
const maxAPI = require('max-api');
const Replicate = require("replicate");

// Attempt to load the dotenv module, which is needed to load the .env file containing the Freesound API keys.
let dotenv_module;
try {
	dotenv_module = require("dotenv");
	dotenv_module.config();
} catch (e) {
	maxAPI.post(e, maxAPI.POST_LEVELS.ERROR);
	maxAPI.post("Could not load the dotenv module. Please be sure to send the message 'script npm install' to the node.script object to download node modules", maxAPI.POST_LEVELS.ERROR);
	process.exit(1);
}

// Make sure that the API keys are loaded. Dotenv will put them in process.env if they are.
if (!process.env.REPLICATE_CLIENT_KEY) {
	maxAPI.post("No value for key REPLICATE_CLIENT_KEY in .env file. Please make sure to create a file called .env with a Freesound API Key.", maxAPI.POST_LEVELS.ERROR);
	process.exit(1);
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_CLIENT_KEY,
});


maxAPI.addHandlers({
	search: async (prompt, duration, model_version) => {
    console.log("search")
		try {
			const start = performance.now();
            console.log(prompt, duration, model_version)
            const output = await replicate.run(
                "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
                {
                  input: {
                    top_k: 250,
                    top_p: 0,
                    prompt: prompt,
                    duration: duration,
                    temperature: 1,
                    continuation: false,
                    model_version: model_version,
                    output_format: "wav",
                    continuation_start: 0,
                    multi_band_diffusion: false,
                    normalization_strategy: "peak",
                    classifier_free_guidance: 3
                  }
                }
              );
            console.log(output);
            maxAPI.post(output)
            const end = performance.now();

            console.log(`Time taken to execute add function is ${(end - start)/1000}ms.`);
            maxAPI.post(`Time taken to execute add function is ${(end - start)/1000}ms.`);

			const url = output;
            await maxAPI.outlet("url", url)
           
		} catch (err) {
			await maxAPI.post("Failed to search Freesound:", maxAPI.POST_LEVELS.ERROR);
			await maxAPI.post(err.message, maxAPI.POST_LEVELS.ERROR);
		}
	},
})