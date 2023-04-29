import { setRequestMeta } from 'next/dist/server/request-meta';
import React, { useState, useEffect, useRef } from 'react'
import { submitComment } from '../services';


const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(false);
  const [emailerror, setEmailerror] = useState(false);
  const [localStorage, setLocalStorage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const commentEl = useRef();
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


  useEffect(() =>{
    nameEl.current.value = window.localStorage.getItem('name');
    emailEl.current.value = window.localStorage.getItem('email'); 
  }, []);


  const handleCommentSubmission = () => {
    setError(false);
    setEmailerror(false);

    const {value: comment} = commentEl.current;
    const {value: name} = nameEl.current;
    const {value: email} = emailEl.current;
    const {checked: storeData} = storeDataEl.current;



    if(!comment || !name || !email){
      setError(true);
      return;
    }

    if(!emailEl.current.value.match(mailformat))
    {
      setEmailerror(true);
      return;
    }



    const commentObj = { name, email, comment, slug };

    if(storeData){
      window.localStorage.setItem('name', name);
      window.localStorage.setItem('email', email);
    } else {
      window.localStorage.removeItem('name', name);
      window.localStorage.removeItem('email', email);
    }

    submitComment(commentObj)
    .then((res) =>{
      setShowSuccessMessage(true);

      setTimeout(() =>{
        setShowSuccessMessage(false);
      }, 3000);
    })

  }



  return (
    <div className='bg-white shadow-lg rounded-lg p-8 pb-20 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pb-4'>Leave your Reply!</h3>
      <div className='grid grid-cols-1 gap-4 mb-4'>
        <textarea ref={commentEl}
          className='p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-300 bg-gray-100'
          placeholder='Your comments matter to us...*'
          name='comment'></textarea>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        <input
          type="text" ref={nameEl}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-300 bg-gray-100"
          placeholder='Name*'
          name='name' />
        <input
          type="text" ref={emailEl}
          className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-300 bg-gray-100"
          placeholder='Email*'
          name='email' />
      </div>
      <div className='grid grid-cols-1 gap-4 mb-4'>
        <div>
          <input ref={storeDataEl} type='checkbox' name='storeData' value='true'/>
          <label className='ml-2 text-gray-500 cursor-pointer' htmlFor='storeData'>Save my e-mail and name for next time</label>
        </div>

      </div>
      {error && <p className='text-s text-red-500'>All fields are required.</p>}
      {emailerror && <p className='text-s text-red-500'>Enter correct email</p>}
      <div className='mt-8'>
        <button
          type='button' 
          onClick={handleCommentSubmission}
          className='transition duration-500 ease hover:bg-pink-500 inline-block bg-purple-600 text-lg rounded-full text-white px-8 py-3 cursor-pointer'>Post your Comment
          </button>
          {showSuccessMessage && <span className='text-xl float-right font:semibold mt-0 text-green-500'>Your view is sumbitted for our review.</span>}

      </div>
    </div>

  )
}

export default CommentsForm;