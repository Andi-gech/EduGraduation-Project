
export default function IsLoading() {
  return (
    <div

    className="w-full  absolute  h-full z-50 flex items-center justify-center   top-0 left-0"
      
      open={true}
    >

        <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full h-16 w-16"></div>
   
    </div>
  );
}
