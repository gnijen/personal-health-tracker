import { useState } from "react";

function Greeting({ name }) {
  return <h1>Good afternoon, {name}</h1>;
}

function RefillCounter() {
  const [refills, setRefills] = useState(2);

  const handlePickup = () => {
    if (refills > 0){
      setRefills(refills - 1)
    }
  }

  return (
    <div>
      <p>Refills left: {refills}</p>
      <button onClick={handlePickup}>I picked up a refill</button>
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>You typed: {email}</p>

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

    </div>
  );
}
function App() {
  return (
    <div>
      <Greeting name="Sara" />
     
      <p>Welcome to your health tracker.</p>
      <RefillCounter />
      <SignInForm />
    </div>
  );
}

export default App;


