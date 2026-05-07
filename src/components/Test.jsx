'use client'

import { useSession } from "next-auth/react";


const Test = () => {
  const session = useSession()
  return (
    <div>
      {
        JSON.stringify(session)
      }
    </div>
  );
};

export default Test;