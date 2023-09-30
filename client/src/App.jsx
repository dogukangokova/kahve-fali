import { useState } from "react"

function App() {


  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [error, setError] = useState(false)
  const [image, setImage] = useState(false)


  const [formData, setFormData] = useState({  
    falSahibi: "",
    commentType: "",
  })

  
  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fileHandler = (e) => {
    const fileReader = new FileReader()
    fileReader.addEventListener("load", function() {
      //console.log(fileReader.result)
      setImage(fileReader.result)
    })
    fileReader.readAsDataURL(e.target.files[0])
  }

  const submitHandler = (e) => {  
    e.preventDefault()
    setLoading(true)
    console.log(formData)
    fetch("http://localhost:3000/kahve-fali", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), 
    }).then((res) => res.json())
    .then(res => {
      if(res?.error) {
        setError(true)
        setComments([])
        //alert(res.error)
      }else{
        setComments(res)
        console.log(res)
        setError(false)
      }
      
    })
    .finally(() => setLoading(false))
  }

  const isDisabled = Object.values(formData).some((value) => !value) || !image || loading
  console.log(isDisabled)
 // console.log(" image"+ image)

  return (
    <div className="max-w-[1000px] mx-auto py-10">


     {
      // <pre>{ JSON.stringify(formData, null, 2) }</pre>
     }

      <form onSubmit={submitHandler}
      className="w-full mb-5 flex items-center gap-x-4"
      >
        <input type="text" value={formData.falSahibi} name="falSahibi"
        placeholder="Ad giriniz"
        onChange={changeHandler} 
        className="h-10 rounded border border-zinc-300 outline-none px-4 sm flex-auto"/>

        <select
        name="commentType"
        onChange={changeHandler} 
        value={formData.commentType}
        className="appearance-none h-10 rounded border border-zinc-300 outline-none px-4 sm flex-auto">
          <option value="">Yorum Tipini Seçin</option>
          <option value="aşk">Aşk</option>
          <option value="para">Para</option>
          <option value="eğitim">Eğitim</option>
          <option value="para">Sağlık</option>
          <option value="hayat">Hayat</option>
        </select>


         <input
           className="relative m-0 block max-w-xs  min-w-0 flex-auto h-10 leading-[1.8rem] rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.35rem]  font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none "
           type="file"
           id="formFile" 
           onChange={fileHandler}
           />
        
        


        <button 
        disabled={isDisabled}
        className="h-10 px-10 rounded bg-blue-500 text-white text-sm disabled:opacity-50 disabled:pointer-events-none">
          {loading ? '...' : 'Yorum üret'} </button>
      </form>

      {image && (
         <div className="mb-[5%]">
            <img src={image} alt="" className="w-25 h-25 rounded-md max-w-xs ml-[30%] object-cover flex justify-center items-center"/>
         </div> 
        )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex">
          Geçersiz bir isim girdiniz, lütfen doğru bir ad ve sayısı ile tekrar deneyin!
        </div>
      )}

      {comments.length > 0 && (
        <div className="grid gap-y-4">
          {comments.map(({comment, name}, key) => (
            // eslint-disable-next-line react/jsx-key
            <section key={key} className="p-4 rounded border border-zinc-300">
              <header className="text-sm font-semibold mb-4">
                <h6 className="bg-blue-500 text-white py-1.5 px-3 inline rounded-md">
                  {name}
                </h6>
              </header>
              <p className="text-sm">
                {comment}
              </p>
            </section>
          ))}
        </div>
      )}
     
    </div>
  )
}

export default App
