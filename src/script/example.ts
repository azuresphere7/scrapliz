import {ScriptResponse} from "../model/response";


export async function exampleScrapDesc() : Promise<ScriptResponse> {
    console.log("Executing exampleScrapDesc()...")
    return {
        message: "Script executed!", resStatus: true, resData: null
    }
}