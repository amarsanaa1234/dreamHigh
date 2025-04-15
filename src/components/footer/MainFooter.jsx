import React from 'react';
import {Button} from "@heroui/react";
import {HeartIcon} from "@heroicons/react/16/solid/index.js";

export const MainFooter = () => {
  return(
    <div className="flex gap-4 items-center justify-center">
      <Button isIconOnly aria-label="Like" color="warning" size="sm" className="bg-primary-500 text-warning-300">
        <HeartIcon />
      </Button>
      made by LUCIFER
    </div>
  )
}