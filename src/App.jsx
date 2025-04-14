import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {Button, Form, Input} from "@heroui/react";
import { useState } from "react";
import { DarkModeSwitch } from "./components/DarkModeSwitch";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-8">
      <DarkModeSwitch />
      
    </div>
  );
}

export default App
