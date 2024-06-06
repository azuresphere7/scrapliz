import {exampleScrapDesc} from "../script/example";
import {ScriptResponse} from "./response";
import {courseraScrapLessonFiles, courseraScrapTranscriptionText} from "../script/coursera";

export interface Scrap {
    id: string;
    name: string;
    hostname: string;
    description: string;
    exec: () => Promise<ScriptResponse>;
}


export const scrapList: Scrap[] = [
    { id: "example_test", name: "Test Scrap", hostname: "example.com", description: "Scrap test", exec: async () => { return exampleScrapDesc(); } },
    { id: "coursera_lesson_dw", name: "Dw Lesson files", hostname: "coursera.org", description: "Download lesson files", exec: async () => { return courseraScrapLessonFiles(); } },
    { id: "coursera_transcription_dw", name: "Dw Lesson transc.", hostname: "coursera.org", description: "Download lesson transc.", exec: async () => { return courseraScrapTranscriptionText(); } },
]