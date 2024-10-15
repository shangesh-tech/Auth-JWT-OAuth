import { useRef, useState } from "react"
import axios from 'axios';


const FileUploader = () => {
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [resultText, setResultText] = useState("");

    const fileInput = useRef();

    const saveFile = ()=>{
        setFile(fileInput.current.files[0]);
        setFileName(fileInput.current.files[0].name)
    }

    const uploadFile = async ()=>{
        const formData = new FormData();
        formData.append('file',file );
        formData.append('fileName',fileName );

        try{
           const res =  await axios.post('http://localhost:3500/upload',
                formData
            )

            setResultText(res.data.message)
            const data = {
                avatar: fileName,
              };
            const response = await axios.put("/api/v1/profile", data);
            console.log(response.data);
            fileInput.current.value = "";
            setTimeout(()=>{
                setResultText("");
            },5000)
        }catch(ex){
            if(ex.response != undefined){
                setResultText(ex.response.data.message)
            }else{
                setResultText("Server Error!")
            }
            setTimeout(()=>{
                setResultText("");
            },5000)
        }


    }


  return (
    <div>
    <input type="file" className="mx-10 file-input file-input-bordered file-input-primary w-full max-w-xs" ref={fileInput} onChange={saveFile}/>
    <button className="btn btn-primary" onClick={uploadFile}>Upload</button>
    {resultText?(<p className="text-red-600">{resultText}</p>):null}
</div>
  )
}

export default FileUploader