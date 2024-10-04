"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { bookingAbi, bookingAddress } from "@/constants";

import { useReadContract } from "wagmi";
import AddRoomModal from "../components/AddRoomModal"
import RoomCard from "../components/RoomCard"


export default function Home() {
  // state
  const [rooms , setRooms] = useState<any>([]);

  const res = useReadContract({
    abi: bookingAbi,
    address: bookingAddress,
    functionName: "getAllRooms"
  })

  const {data: roomData} = res;

  
  // hook
  useEffect( () => {
    console.log("was invoked update",roomData);
    if(roomData){
      setRooms(roomData);
    }
  } ,[roomData] )

  return (
    <main>
      <section className="py-12 flex items-center justify-between text-center gap-8">
        <h1 className="text-lg font-bold">Owner actions:</h1>
        <div className=" text-lg font-bold flex item-center gap-2">
          <AddRoomModal>
            <Button>Add room</Button>
          </AddRoomModal>

          <Button onClick={ () => {
            console.log(roomData);
            console.log(res);
          } }> set availability</Button>
        </div>
      </section>


      <div>
        {
          rooms.length > 0 ? (
            rooms?.map( (room: any) => (
              <>
                { console.log(room) }
                <RoomCard key={room.id} room={room} />
              </>
            ) )
          ) :
          <div> 
            <h1 className="text-2xl font-semibold">No rooms available</h1>  
          </div>
        }
      </div>
    </main>
  );
}
