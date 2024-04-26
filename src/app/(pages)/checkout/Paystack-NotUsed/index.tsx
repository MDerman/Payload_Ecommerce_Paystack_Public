import { FormEventHandler, useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import "./index.module.scss";

type referenceObj = {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
};

const Paystack: React.FC = (): JSX.Element => {
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(false);
    setRef("" + Math.floor(Math.random() * 1000000000 + 1));
  }, [success]);

  const config: PaystackProps = {
    reference: ref,
    email: email,
    firstname: name,
    lastname: surname,
    label: name + " " + surname,
    amount: (amount * 100) | 0,
    //publicKey: 'pk_test_cf176bc2db7970bcb92e2435f18d80b74d5d2532',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_TEST_KEY as string,
    currency: "ZAR",
  };

  const onSuccess = async (reference: referenceObj) => {
    const res = await fetch(`/api/verify/${reference.reference}`);
    const verifyData = await res.json();

    if (verifyData.data.status === "success") {
      setSuccess(true);
      setEmail("");
      setAmount(0);
      setName("");
      setSurname("");
    }
  };

  const onClose = () => {
    alert("Payment cancelled.");
  };

  const componentProps = {
    ...config,
    text: `Pay R${amount | 0}`,
    //onSuccess,
    onClose
  };



  return (
    <div id="paymentForm" >
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email-address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          step="0.01"
          min={0}
          id="amount"
          required
          value={amount}
          onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label htmlFor="first-name">First Name</label>
        <input
          type="text"
          id="first-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last-name">Last Name</label>
        <input
          type="text"
          id="last-name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <PaystackButton {...componentProps} />
    </div>
  );
};
export default Paystack;
