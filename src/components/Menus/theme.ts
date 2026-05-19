import {theme as appTheme} from "../../styles/theme.ts";

export const theme = {
    token: {
        colorText: appTheme.colors.textInverse, // Text color of dropdown button
        colorPrimary: appTheme.colors.primary, // Hover background color of dropdown button
    },
    components: {
        Dropdown: {
            colorText: appTheme.colors.primary, // Text color of dropdown menu items.
            colorTextHover: appTheme.colors.textInverse, // Text color of dropdown menu items on hover
            borderRadius: 5, // Border radius of dropdown menu items
            colorBgElevated: appTheme.colors.surface, // Background color of dropdown menu
            borderRadiusLG: 5, // Border radius of dropdown button
            borderRadiusSM: 5, // Border radius of dropdown menu items

        },
        Button: {
            borderRadius: 5, // Border radius of the dropdown button
            colorBgContainer: appTheme.colors.primary, // Background color of dropdown button
        },
    },
};
