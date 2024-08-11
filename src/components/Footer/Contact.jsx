import React from 'react';
import { FiMail, FiMapPin } from 'react-icons/fi';

const contact = [
  {
    icon: <FiMail />,
    title: 'Have a question?',
    subtitle: 'We are here to help you.',
    description: 'Email us at support@dtupixels.com',
  },
  {
    icon: <FiMapPin />,
    title: 'Current Location',
    subtitle: 'New Delhi, India',
    description: 'DTU Campus, Main Building',
  },
];

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <section className='py-12 bg-gray-900' id='contact'>
      <div className='container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg'>
        {/* Section title */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className='py-4 relative font-bold text-white text-4xl mb-4'>
            Get in Touch
          </h2>
          <p className='text-gray-400'>
            We’re here to answer any questions you may have. Whether you need support or just want to say hello, don’t hesitate to reach out. Your feedback is important to us and we look forward to connecting with you.
          </p>
        </div>
        <div className="flex flex-col lg:gap-x-8 lg:flex-row">
          {/* Info */}
          <div className='flex flex-1 flex-col items-start px-6 space-y-8 mb-12 lg:mb-0 lg:pt-2'>
            {contact.map((item, index) => {
              const { icon, title, subtitle, description } = item;
              return (
                <div className='flex flex-col lg:flex-row gap-x-4' key={index}>
                  <div className='rounded-sm w-14 h-14 flex items-start justify-center mt-2 mb-4 lg:mb-0 text-2xl text-orange-500'>
                    {icon}
                  </div>
                  <div>
                    <h4 className='text-xl font-bold text-white mb-1'>{title}</h4>
                    <p className='text-gray-400 mb-1'>{subtitle}</p>
                    <p className='text-gray-300'>{description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Form */}
          <form className='space-y-8 w-full max-w-[780px]' onSubmit={handleSubmit}>
            <div className='flex gap-8'>
              <input 
                className='bg-gray-700 text-white h-15 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm' 
                type="text" 
                placeholder='Your name' 
              />
              <input 
                className='bg-gray-700 text-white h-15 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm'
                type="email" 
                placeholder='Your email' 
              />
            </div>
            <input 
              type="text" 
              className='bg-gray-700 text-white h-15 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm' 
              placeholder='Subject' 
            />
            <textarea
              className='bg-gray-700 text-white h-15 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm'
              placeholder='Your message'
            ></textarea>
            <button className='bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300' type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact;

