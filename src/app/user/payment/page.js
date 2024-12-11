"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { getAllEmisofUser, payEmi } from "@/lib/emis";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { verifyToken } from "@/lib/users";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emiId = searchParams.get("emiId");
  
  const [emiDetails , setEmiDetails] = useState([]); 

  const fetchEmis = async () => {
    try {      
      const tokenData = await verifyToken();;
      const id = tokenData.id; 
      const response = await getAllEmisofUser(id)
     
      
      const requiredEntry = response.find((entry) =>
            entry.emis.some((data) => data.id === emiId)
       );
     
      setEmiDetails(requiredEntry);
      
    } catch (error) {
      console.error("Error fetching EMIs:", error);
    }
  };

  useEffect(() => {
    fetchEmis();
  }, []);

  const { register, handleSubmit } = useForm();
  const [cardData, setCardData] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });
  const [focused, setFocused] = useState("");

  const handleInputFocus = (e) => {
    setFocused(e.target.name);
  };

  

  const onSubmit = async() => {
    let res = await payEmi(emiId);
    if(res){
        toast.success(`Payment  was successful!`);
    }else{
        toast.error(`Payment  was failed!`);
    }
    router.push("/user/pay-emi"); 
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Payment Details</h2>
      <p className="text-gray-700 font-bold mb-6">Amount: {emiDetails.emiAmount}</p>
      
      <div className="mb-6">
        <Cards
          cvc={cardData.cvc}
          expiry={cardData.expiry}
          focused={focused}
          name={cardData.name}
          number={cardData.number}
        />
      </div>

     
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Card Number</label>
          <input
            type="text"
            name="number"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Card Number"
            {...register("number", { required: true })}
            onChange={(e) => setCardData({ ...cardData, [e.target.name]: e.target.value })}
            onFocus={handleInputFocus}
          />
        </div>
        <div>
          <label className="block text-gray-700">Cardholder Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Name on Card"
            {...register("name", { required: true })}
            onChange={(e) => setCardData({ ...cardData, [e.target.name]: e.target.value })}
            onFocus={handleInputFocus}
          />
        </div>
        <div className="flex space-x-4">
          <div>
            <label className="block text-gray-700">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="MM/YY"
              {...register("expiry", { required: true })}
              onChange={(e) => setCardData({ ...cardData, [e.target.name]: e.target.value })}
              onFocus={handleInputFocus}
            />
          </div>
          <div>
            <label className="block text-gray-700">CVC</label>
            <input
              type="text"
              name="cvc"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="CVC"
              {...register("cvc", { required: true })}
              onChange={(e) => setCardData({ ...cardData, [e.target.name]: e.target.value })}
              onFocus={handleInputFocus}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;