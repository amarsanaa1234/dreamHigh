import {addToast} from "@heroui/react";

export function showMessage(props) {
    switch (props.type) {
        case "success":
            return addToast({
                title: "Амжилттай.",
                description: props.text,
                color: 'success',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        case 'warning':
            return addToast({
                title: "Анхааруулга.",
                description: props.text,
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        case 'danger':
            return addToast({
                title: "Алдаа.",
                description: props.text,
                color: 'danger',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        case 'primary':
            return addToast({
                title: "Мэдээлэл.",
                description: props.text,
                color: 'primary',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        default:
            return;
    }
}

export const isNullOrEmpty = (value) => {
    return !value || value === "null" || value === "undefined";
}

export const isNullOrEmptyArray = (value) => {
    return !value || value.length === 0;
}