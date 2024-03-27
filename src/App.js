import { useEffect, useState } from 'react';
import "./index.css"
import {Trash2,SquarePen, MicOff,Circle} from "lucide-react"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


// *************** to get the data from Local storage *****************


// ab humne niche set krdia tha apne local Item ko ab get v toh krna pdega ...toh wo hum yha kr re h
const getLocalItems = ()=>{              
  let listItem = localStorage.getItem('Lists')        // simple hai.. localstorage.getItem() krdo bs ..or ha esme v string format me hi hoga... or jo hoga na..wo whi wala hoga jo niche setItems me phala wala likha tha means ki key, mtlb niche humne   likha tha na Lists whi yha likhna hia..bs ase hi use hota h LocalStorage.

  if(listItem){    
    return JSON.parse(localStorage.getItem('Lists') )    // see..ab baat ye h ki.. yha hume data mil raha hoga string format me ..or niche useState(getLocalItems()); <---- yha humara () eske andar array expect kr ra hai..toh eslie humne json.parse kra taki..wo object me convert hojaye(object m hoga tab v chl jyga) 
  }else{
    return []     // or simply.. agar list me kuch v nahi hota..toh simple array return krdo.
  }
}


function App() {
  const {
    transcript,resetTranscript,listening,
  } = useSpeechRecognition();
const [micActive, setMicActive] = useState(false); 
const [Input, setInput] = useState("");
const [items, setitems] = useState(getLocalItems());         // yha humne call kra h getlocalitem ko taki.. hum value get kr paye..after refresh vi...or humne yhi pe hi q call kri?? qki..yhi data store hora hai na sara jo v list down kr re hai.. esliee...


// Toggle mic activation
const toggleMic = () => {
  if (listening) {
    SpeechRecognition.stopListening();
  } else {
    setInput("");
    SpeechRecognition.startListening();
  }
  setMicActive(!listening);
};


// Adding items 
const addItems = () => {
  if (!Input.trim() && !transcript.trim()) {
      alert("Please Enter Something");
      return;
  }

  // Use transcript if available, otherwise use Input
  const newItem = transcript.trim() || Input.trim();

  setitems([...items, newItem]);
  setInput(""); // Clear the input field 
  resetTranscript();
};


// deleting Particular Items
const deleteItems=(i)=>{
  const updatedData= items.filter((ele,id)=>{
    return id != i
  })
  setitems(updatedData);
}

// deleting All items 
const RemoveAll=()=>{
   setitems([]);
}

// Listen for speech recognition events to update micActive state
useEffect(() => {
  setMicActive(listening);
}, [listening]);

// *********  Add data to local storage  ************
useEffect(() => {
  localStorage.setItem('Lists',JSON.stringify(items))   // yha setItem jo hai wo key,value format me data leta hia..ab eska kya mtlb hai? mtlb ki jo pahala wala hoga wo toh string format me hoga..or uska naam tum kuch v rkh sakte ho..jaise maine avi yha lists rkha hai..toh jaroori nahi yhi hoga kuch v rkh sakte ho..like abc,xyz..etc. 

  // Yha jo dono data hoti hai..wo string format me hi hogi...mtlb local storage me data hmesa string format me hi jata hia..toh agar tumhara string format me nahi h toh use string me bnao... yha mai JSON.Stringify use kr ra hu ..usko string m convert krne k lie
}, [items])   // yha pe humne items hi q lie? qki...hum items me hi toh sare task list down krwa re h 


// Editing functionality :-


 // State to track which item is being edited
 const [editIndex, setEditIndex] = useState(-1);
 const [editValue, setEditValue] = useState("");

 // Function to start editing an item
 const startEdit = (index, value) => {
   setEditIndex(index);
   setEditValue(value);
 };

 // Function to save edited item
 const saveEdit = (index) => {
   const updatedItems = [...items];
   updatedItems[index] = editValue.trim();
   setitems(updatedItems);
   setEditIndex(-1);
 };

 // Function to cancel editing
 const cancelEdit = () => {
   setEditIndex(-1);
   setEditValue("");
 };

 // JSX for rendering list items
 const renderListItems = () => {
   return items.map((element, i) => {
     return (
       <div className='flex justify-between' key={i}>
         <div className='flex justify-between m-2 border-2 p-2 rounded-lg w-64 overflow-hidden'>
           {editIndex === i ? (
             <input
               type="text"
               className='outline-none rounded-md w-64'
               value={editValue}
               onChange={(e) => setEditValue(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   saveEdit(i);
                 } else if (e.key === 'Escape') {
                   cancelEdit();
                 }
               }}
               autoFocus
             />
           ) : (
             element
           )}
         </div>
         <div className='flex gap-2 items-center hover:cursor-pointer'>
           <SquarePen
             className='text-gray-500 hover:text-gray-700'
             size={20}
             onClick={() => startEdit(i, element)}
           />
           <Trash2 className='text-red-600 hover:text-red-700' onClick={() => deleteItems(i)} size={20} />
         </div>
       </div>
     );
   });
 };







  return (
    <div className='bg-red-100 h-screen'>

    <div className='flex justify-center relative top-32'>

        
    <div className="w-full max-w-sm p-4 border bg-white border-gray-200 rounded-3xl shadow-lg sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    
    <h1 className='font-bold text-2xl text-center mb-2'>TODO List</h1>
    <hr className='text-gray-400 font-bold shadow-lg border  mb-10' />

    <form className="flex items-center max-w-lg mx-auto" onSubmit={(e)=>e.preventDefault()}>   
        <div className="relative ml-2">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"/>
            </svg> 
            </div>
            <input type="text" id="voice-search" className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 ps-10 pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Tasks"  value={Input || transcript} onChange={(e)=>setInput(e.target.value)}/>
            
            <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3" onClick={toggleMic}>
                  {micActive ? <Circle className="w-4 h-4 text-red-500 dark:text-red-400 hover:text-red-900 dark:hover:text-red bg-red-500 rounded-full border-4 border-gray-300"/> :  <MicOff className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" /> }
              </button>
        </div>

        
        <button type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addItems}>
        +Add
        </button>
    </form>


     {/* List Items  */}
    <div className=' mt-10'>
    {renderListItems()}
    </div>

    {/* Remove All button  */}
    <button type="button" className="text-white mt-10 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center" onClick={RemoveAll}>Remove All</button>
    </div>   
    
    </div>
    </div>
  );
}

export default App;





// LOCAL STORAGE : Agenda- agar humne koi v data apne Dom me show kra hai..thik hai toh I dont want ki agar banda refresh maare page toh wo data v loss hojaye..eslie hum local storage use krte hai...ess se kya hota h ki.. agar hum refressh v mare toh na..data loss nahi hota !! whi pda rhta h as it is. 

// Bahut easy hai yr.. : esme bas [ setItem krna hota hia..or getItem krna hota hia] bss hogaya yhi toh hai. 