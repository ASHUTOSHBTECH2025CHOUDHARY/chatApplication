import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors=(errors=[])=>{
    
    useEffect(()=>{
        errors.forEach(({isError,error,fallback})=>{
            if(isError) 
                if(fallback) fallback()
                else toast.error(error?.data?.message||"Something went wrong")
        })
    },[errors])
}

const useAsyncmutation=(mutationHook)=>{
    const [isLoading,setisLoading]=useState(false);
    const [data,setdata]=useState(null);
    const [mutate]= mutationHook();
    const executeMutation=async(toastMessage,...arg)=>{
        setisLoading(true);
        console.log(isLoading)
        const toastId=toast.loading(toastMessage||"Updating data...")
        try {
              const res=await mutate(...arg);
              if(res.data){
                toast.success(res.data.message||"Updated data successfully",{
                    id:toastId
                })
                setdata(res.data)
              }
              else{
                console.log(res.error)
                toast.success(res.error.data.message||"Something went Wrong",{
                    id:toastId
                })
              }
            } catch (error) {
              console.log(error)
              toast.error("Something went wrong",{id:toastId})
            }
            finally{
            setisLoading(false)
        }
    }
    return [executeMutation,isLoading,data]
}

const useSocketEvents=(socket,handlers)=>{
    useEffect(() => {
        Object.entries (handlers).forEach(([event,handler])=>{
                socket.on(event, handler);
        })
        return ()=>{
            Object.entries (handlers).forEach(([event,handler])=>{
            socket.off(event, handler);
            })
        };
    }, [socket,handlers]);
}
export {useErrors,useAsyncmutation,useSocketEvents}