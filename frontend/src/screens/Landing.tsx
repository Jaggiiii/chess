// Replace with appropriate import if not using Next.js
import { Link } from "react-router-dom"; // Adjust based on your routing library

export const  Landing =()=> {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-teal-400  via-purple-500 via-sky-500 to-violet-500 ">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
         
          <img src="/chess.jpeg?height=600&width=600"
            width={600}
            height={600}
            alt="Chess game illustration"
            className="rounded-lg shadow-xl"/>
          
        </div>
        <div className="w-full md:w-1/2 md:pl-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Play Chess Online
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-white">
            Experience the thrill of chess on the #2 online platform. Challenge players worldwide and improve your skills.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              to="/game" // Use 'to' instead of 'href' with react-router
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-300 hover:bg-teal-700"
            >
              Start Playing Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
