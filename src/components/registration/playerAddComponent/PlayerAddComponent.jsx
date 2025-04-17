import React, {useEffect, useRef, useState} from 'react'
import {supabase} from "../../../tools/SupabaseClient.jsx";
import {showMessage} from "../../../tools/Tools.jsx";
import {Button, Card, CardBody, CardHeader, Checkbox, Form, Input, Select, SelectItem} from "@heroui/react";

export const PlayerAddComponent = () => {
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [teamList, setTeamList] = useState([]);

    const formRef = useRef(null);

    const onImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    useEffect(() => {
        const fetchTeams = async () => {
            const { data, error } = await supabase.from("team").select("*").eq("active_flag", 1);
            if (error) {
                showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
            } else {
                setTeamList(data);
            }
        };

        fetchTeams();
    }, []);

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

        setErrors({});

        try {

            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `team/${fileName}`;

            const { error: uploadError } = await supabase
                .storage
                .from('dream-high-image')
                .upload(filePath, image);

            if (uploadError) {
                console.error("Upload error:", uploadError.message);
                showMessage({ type: "error", text: "Зураг оруулахад алдаа гарлаа!" });
                return;
            }

            const { data: publicUrlData } = supabase.storage.from('dream-high-image').getPublicUrl(filePath);

            const imageUrl = publicUrlData.publicUrl;

            const insertData = {
                team_id: data.team_id,
                lastname: data.lastname,
                firstname: data.firstname,
                job_position: data.job_position,
                work_year: parseInt(data.work_year),
                sport_type: parseInt(data.sport_type),
                role: data.role,
                player_num: parseInt(data.player_num),
                image: imageUrl,
                gender: parseInt(data.gender),
                active_flag: 1,
            };

            const { error } = await supabase.from("player").insert([insertData]).single();

            if (error) {
                console.error("Upload error:", error.message);
            } else {
                showMessage({ type: "success", text: "Амжилттай хадгаллаа." });
                formRef.current.reset();
            }
        } catch (err) {
            console.error("Image conversion error:", err);
        }
    };

    return (
        <>
            <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50 w-[700px]" shadow="sm">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start m-3">
                    <small className="text-default-foreground">Тоглогчийн бүртгэл</small>
                </CardHeader>
                <CardBody className="overflow-visible pb-14 pt-10 ">
                    <Form
                        ref={formRef}
                        className="w-full flex flex-row flex-wrap justify-around items-center"
                        validationErrors={errors}
                        onSubmit={onSubmit}
                    >
                        <div className="gap-4 w-60 flex flex-col flex wrap">
                            <Select
                                isRequired
                                label="Баг"
                                labelPlacement="outside"
                                name="team_id"
                                placeholder="Багаа сонгоно уу!"
                            >
                                {teamList.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Input
                                isRequired
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Овогоо оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                label="Овог"
                                labelPlacement="outside"
                                name="lastname"
                                placeholder="Овог оруулна уу!"
                            />
                            <Input
                                isRequired
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Hэр оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                label="Hэр"
                                labelPlacement="outside"
                                name="firstname"
                                placeholder="Hэр оруулна уу!"
                            />
                            <Input
                                isRequired
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Албан тушаал оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                label="Албан тушаал"
                                labelPlacement="outside"
                                name="job_position"
                                placeholder="Албан тушаал оруулна уу!"
                            />
                            <Input
                                label="Ажилласан жил"
                                labelPlacement="outside"
                                placeholder="0"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">жил</span>
                                    </div>
                                }
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Ажилласан жил оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                type="number"
                                name="work_year"
                            />
                        </div>
                        <div className="gap-4 w-60 flex flex-col flex-wrap">
                            <Input
                                isRequired
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Үүрэг, байрлал оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                label="Үүрэг, байрлал"
                                labelPlacement="outside"
                                name="role"
                                placeholder="Үүрэг, байрлал оруулна уу!"
                            />
                            <Input
                                label="Өмсгөлийн дугаар"
                                labelPlacement="outside"
                                placeholder="0"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">жил</span>
                                    </div>
                                }
                                errorMessage={({validationDetails}) => {
                                    if (validationDetails.valueMissing) {
                                        return "Ажилласан жил оруулна уу!";
                                    }

                                    return errors.name;
                                }}
                                type="number"
                                name="player_num"
                            />
                            <Input
                                type="file"
                                label="Багийн лого зураг оруулна уу!"
                                name="image"
                                accept="image/*"
                                onChange={onImageChange}
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
                                name="sport_type"
                                placeholder="Тэмцээний төрлөө сонгоно уу!"
                            >
                                <SelectItem key={1}>BASKETBALL</SelectItem>
                                <SelectItem key={2}>VOLLEYBALL</SelectItem>
                            </Select>
                        </div>
                        <div className="gap-4 w-60 flex flex-col flex-wrap">
                            <Checkbox
                                isRequired
                                classNames={{label: "text-small",}}
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
                                <Button className="w-full" color="primary" type="submit" size="sm">
                                    Хадгалах
                                </Button>
                                <Button type="reset" variant="bordered" size="sm">
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