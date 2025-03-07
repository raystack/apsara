"use client";

export const preview = {
  type: "code",
  code: `
  function ToastTest(){
  return <div>
    <ToastContainer />
    <Button
      onClick={() => toast.success("This is a toast")}>
      Trigger toast
    </Button>
    </div>
}`,
};
