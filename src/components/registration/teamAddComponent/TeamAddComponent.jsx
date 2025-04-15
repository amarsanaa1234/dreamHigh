import React, {useState} from 'react'
import {addToast, Button, Card, CardBody, CardHeader, Checkbox, Form, Input, Select, SelectItem} from "@heroui/react";
import {showMessage} from "../../../tools/Tools.jsx";
import supabase from "../../../tools/SupabaseClient.jsx";

export const TeamAddComponent = () => {
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.terms !== "true") {
      setErrors({ terms: "Итгэлгүй байгаамуудаа вуудада" });
      return;
    }

    if (!image) {
      setErrors({ terms: "Зургаа оруулаарай хө" });
      return;
    }

    setErrors({}); // clear errors

    try {
      // Convert image to binary (Uint8Array)
      const arrayBuffer = await image.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Create full row data object
      const insertData = {
        name: data.name,
        nickname: data.nickname,
        gender: data.gender, // assuming one gender select stays
        image: uint8Array, // <-- this is the bytea image column
      };

      const { error } = await supabase.from("team").insert([insertData]);

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        showMessage({ type: "success", text: "Амжилттай хадгаллаа." });
        setSubmitted(null);
      }
    } catch (err) {
      console.error("Image conversion error:", err);
    }
  };

  return (
    <>
      <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50 w-1/3" shadow="sm">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start m-3">
          <small className="text-default-foreground">Багийн бүртгэл</small>
        </CardHeader>
        <CardBody className="overflow-visible pb-14 pt-10">
          <Form
            className="w-full justify-center items-center space-y-4"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
          >
            <div className="flex flex-col gap-4 max-w-md">
              <Input
                isRequired
                errorMessage={({validationDetails}) => {
                  if (validationDetails.valueMissing) {
                    return "Багийн нэр оруулна уу!";
                  }

                  return errors.name;
                }}
                label="Багийн нэр"
                labelPlacement="outside"
                name="name"
                placeholder="Багийн нэр оруулна уу!"
              />

              <Input
                type="file"
                label="Багийн лого зураг оруулна уу!"
                name="image"
                accept="image/*"
                onChange={onImageChange}
              />

              <Input
                isRequired
                errorMessage={({validationDetails}) => {
                  if (validationDetails.valueMissing) {
                    return "Байгууллагын нэр оруулна уу!";
                  }

                  return errors.name;
                }}
                label="Байгууллагын нэр"
                labelPlacement="outside"
                name="nickname"
                placeholder="Байгууллагын нэр оруулна уу!"
              />

              <Select
                isRequired
                label="Хүйс"
                labelPlacement="outside"
                name="gender"
                placeholder="Хүйс сонгоно уу!"
              >
                <SelectItem key={1}>Эрэгтэй</SelectItem>
                <SelectItem key={2}>Эмэгтэй</SelectItem>
              </Select>

              <Select
                isRequired
                label="Тэмцээний төрөл"
                labelPlacement="outside"
                name="gender"
                placeholder="Тэмцээний төрлөө сонгоно уу!"
              >
                <SelectItem key={1}>BASKETBALL</SelectItem>
                <SelectItem key={2}>VOLLEYBALL</SelectItem>
              </Select>

              <Checkbox
                isRequired
                classNames={{
                  label: "text-small",
                }}
                isInvalid={!!errors.terms}
                name="terms"
                validationBehavior="aria"
                value="true"
                onValueChange={() => setErrors((prev) => ({...prev, terms: undefined}))}
              >
                Хадгалахдаа итгэлтэй байна уу?
              </Checkbox>

              {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

              <div className="flex gap-4">
                <Button className="w-full" color="primary" type="submit">
                  Хадгалах
                </Button>
                <Button type="reset" variant="bordered">
                  Цэвэрлэх
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}