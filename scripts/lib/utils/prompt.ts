import chalk from "chalk";

async function getInputFromPrompt(prompt: string): Promise<string> {
    process.stdout.write(chalk.cyan(`> ${prompt}: `));
    let line: string;
    for await (const inLine of console) {
      line = inLine;
      break;
    }
  
    return line! ?? '';
  }

  export default getInputFromPrompt;