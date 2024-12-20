import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../providers/AuthProvider'
import toast from 'react-hot-toast'

const JobDetails = () => {
  const { user } = useContext(AuthContext)
  const [startDate, setStartDate] = useState(new Date())
  const { id } = useParams();
  const [job, setJob] = useState({});
  console.log(job);
  useEffect(() => {
    axios.get(`http://localhost:9000/jobById/${id}`)
      .then(data => {
        console.log(data.data);
        setJob(data.data)
      })
  }, [])

  const handleBids = e => {
    e.preventDefault();
    const form = e.target;
    const price = form.price.value
    const email = user?.email
    const comment = form.comment.value
    const deadline = new Date(startDate).toLocaleDateString('en-US')

    // 1. deadline validation
    const buyerDeadline = new Date(job.deadline)
    const bidderDeadline = new Date(startDate)

    // 3. email validation
    if (job?.email === user?.email) {
      return toast.error('You cant not bid you job post try another')
    }

    if (bidderDeadline > buyerDeadline) {
      return toast.error('Deadline has passed, you cannot proceed with bidding.');
    }

    // 2. price validation
    if (parseFloat(price) > job.max_price) {
      return toast.error(`price maximum ${job.max_price}`)
    }

    const bids = {
      bid_id: job?._id,
      price,
      email,
      comment,
      deadline: deadline,
      job_title: job.job_title,
      category: job.category,
      status: 'Pending',
      buyerEmail: job.email
    };

    //  send data in server using axios
    axios.post('http://localhost:9000/bids', bids)
      .then(data => {
        console.log(data.data);
        if (data.data.insertedId) {
          toast.success('Bid successfully')
        }
      })
      .catch(error => {
        return toast.error(error.response.data.message)
      })

  }

  return (
    <div className='flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto '>
      {/* Job Details */}
      <div className='flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-light text-gray-800 '>
            Deadline: {job.deadline}
          </span>
          <span className='px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full '>
            {job.category}
          </span>
        </div>

        <div>
          <h1 className='mt-2 text-3xl font-semibold text-gray-800 '>
            {job.job_title}
          </h1>


          <p className='mt-6 text-sm font-bold text-gray-600 '>
            Buyer Details:
          </p>
          <div className='flex items-center gap-5'>
            <div>
              <p className='mt-2 text-sm  text-gray-600 '>
                Name:  ***
              </p>
              <p className='mt-2 text-sm  text-gray-600 '>
                Email:  {job.email}
              </p>
            </div>
            <div className='rounded-full object-cover overflow-hidden w-14 h-14'>
              {/* <img
                src='https://i.ibb.co.com/qsfs2TW/Ix-I18-R8-Y-400x400.jpg'
                alt=''
              /> */}
            </div>
          </div>
          <p className='mt-6 text-lg font-bold text-gray-600 '>
            Range: ${job.min_price} - ${job.max_price}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className='p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Place A Bid
        </h2>

        <form onSubmit={handleBids}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='price'>
                Price
              </label>
              <input
                id='price'
                type='text'
                name='price'
                required
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                defaultValue={user.email}
                id='emailAddress'
                type='email'
                name='email'
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='comment'>
                Comment
              </label>
              <input
                id='comment'
                name='comment'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              type='submit'
              className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default JobDetails
