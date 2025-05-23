import { createContext, useState } from "react";
import run from "../../gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord) => {
        setTimeout(function() {
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }
    const onSent = async (prompt,cardselect) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt!==undefined && cardselect===undefined){
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else if(prompt!==undefined && cardselect===true){
            setPrevPrompts(prev=>[...prev,prompt])
            setRecentPrompt(prompt)
            response = await run(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }
        let responseArray = response.split("**")
        let newResponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i%2===0) newResponse+=responseArray[i];
            else newResponse+="<b>"+responseArray[i]+"</b>"
        }
        newResponse=newResponse.split('*').join('<br/>')
        let newResponseArray = newResponse.split(" ")
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        loading,
        resultData,
        input,
        setInput,
        showResult,
        newChat,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
