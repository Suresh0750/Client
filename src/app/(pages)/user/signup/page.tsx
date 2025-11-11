

import {SignupForm} from '@/components/User/SignupForm'



export default function SigupPage(){
    return(
        <>
        <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-5">
            <div></div>
            <h2 className="text-center font-bold text-3xl pt-3 mt-28 text-gray-800 relative">Create Your Account</h2>
            <div className="">
                <section className='flex justify-center items-center'>
                    <SignupForm/>
                </section>
            </div>
        </main>
        </>
    )
}