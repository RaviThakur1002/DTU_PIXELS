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
  };

  return (
    <section className='py-12 bg-black' id='contact'>
      <div className='container mx-auto rounded-lg shadow-lg'>
        {/* Inner Container with Black Background */}
        <div className='bg-[#171717] p-6 rounded-lg shadow-lg'>
          {/* Section title */}
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className='py-4 font-bold text-4xl mb-4 text-[#dc8add]'>
              Get in Touch
            </h2>
           <p className='text-gray-300 text-lg'>
  Got questions? Reach out anytime! Your feedback is important to us, and we look forward to connecting with you.
</p>

          </div>
          <div className="flex flex-col lg:gap-x-8 lg:flex-row">
            {/* Info */}
            <div className='flex flex-1 flex-col items-start space-y-8 mb-12 lg:mb-0 lg:pt-2'>
              {contact.map((item, index) => {
                const { icon, title, subtitle, description } = item;
                return (
                  <div className='flex flex-col lg:flex-row gap-x-4 bg-[#2c2c2e] p-4 rounded-lg shadow-md shadow-black/50' key={index}>
                    <div className='rounded-sm w-14 h-14 flex items-center justify-center mt-2 mb-4 lg:mb-0 text-2xl text-[#6528d7]'>
                      {icon}
                    </div>
                    <div>
                      <h4 className='text-xl font-bold text-[#c638ab] mb-1'>{title}</h4>
                      <p className='text-gray-400 mb-1'>{subtitle}</p>
                      <p className='text-gray-300'>{description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Form */}
            <form className='space-y-8 w-full max-w-[780px]' onSubmit={handleSubmit}>
              <div className='flex flex-col sm:flex-row gap-8'>
                <input 
                  className='bg-[#171717] text-white h-12 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6528d7] focus:border-transparent shadow-sm' 
                  type="text" 
                  placeholder='Your name' 
                />
                <input 
                  className='bg-[#171717] text-white h-12 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6528d7] focus:border-transparent shadow-sm'
                  type="email" 
                  placeholder='Your email' 
                />
              </div>
              <input 
                type="text" 
                className='bg-[#171717] text-white h-12 py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6528d7] focus:border-transparent shadow-sm' 
                placeholder='Subject' 
              />
              <textarea
                className='bg-[#171717] text-white py-3 px-6 w-full text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6528d7] focus:border-transparent shadow-sm'
                placeholder='Your message'
                rows="4"
              ></textarea>
              <button className='bg-[#9f0ad6] text-white py-3 px-6 rounded-lg hover:bg-[#b00bef] transition duration-300 w-full sm:w-auto' type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

