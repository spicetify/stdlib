/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { React } from "../src/expose/React.js";
import { SettingsSection, SettingsSectionTitle } from "../src/expose/SettingsSection.js";
import { UI } from "../src/webpack/ComponentLibrary.js";
import { SettingColumn, SettingText, SettingToggle } from "../src/webpack/ReactComponents.js";
export var FieldType;
(function(FieldType) {
    FieldType["BUTTON"] = "button";
    FieldType["TOGGLE"] = "toggle";
    FieldType["INPUT"] = "input";
    FieldType["HIDDEN"] = "hidden";
})(FieldType || (FieldType = {}));
import SettingsSectionRegistry from "../src/registers/settingsSection.js";
import SettingsButton from "./components/SettingsButton.js";
export class Settings {
    name;
    id;
    sectionFields;
    proxy;
    getName() {
        return this.name;
    }
    constructor(name, id){
        this.name = name;
        this.id = id;
        this.sectionFields = {};
        this.finalize = ()=>{
            SettingsSectionRegistry.add(/*#__PURE__*/ React.createElement(this.SettingsSection, null));
            return this;
        };
        this.addButton = (props)=>{
            this.addField("button", props, this.ButtonField);
            return this;
        };
        this.addToggle = (props, defaultValue = ()=>false)=>{
            this.addField("toggle", props, this.ToggleField, defaultValue);
            return this;
        };
        this.addInput = (props, defaultValue = ()=>"")=>{
            this.addField("input", props, this.InputField, defaultValue);
            return this;
        };
        this.getId = (nameId)=>[
                "settings",
                this.id,
                nameId
            ].join(":");
        this.useStateFor = (id)=>{
            const [value, setValueState] = React.useState(Settings.getFieldValue(id));
            return [
                value,
                (newValue)=>{
                    if (newValue !== undefined) {
                        setValueState(newValue);
                        Settings.setFieldValue(id, newValue);
                    }
                }
            ];
        };
        this.SettingsSection = ()=>/*#__PURE__*/ React.createElement(SettingsSection, {
                filterMatchQuery: this.name
            }, /*#__PURE__*/ React.createElement(SettingsSectionTitle, null, this.name), Object.values(this.sectionFields));
        this.SettingField = ({ field, children })=>/*#__PURE__*/ React.createElement(SettingColumn, {
                filterMatchQuery: field.id
            }, /*#__PURE__*/ React.createElement("div", {
                className: "x-settings-firstColumn"
            }, /*#__PURE__*/ React.createElement(SettingText, {
                htmlFor: field.id
            }, field.desc)), /*#__PURE__*/ React.createElement("div", {
                className: "x-settings-secondColumn"
            }, children));
        this.ButtonField = (field)=>/*#__PURE__*/ React.createElement(this.SettingField, {
                field: field
            }, /*#__PURE__*/ React.createElement(UI.ButtonSecondary, {
                id: field.id,
                buttonSize: "sm",
                onClick: field.onClick,
                className: "x-settings-button"
            }, field.text));
        this.ToggleField = (field)=>{
            const id = this.getId(field.id);
            const [value, setValue] = this.useStateFor(id);
            return /*#__PURE__*/ React.createElement(this.SettingField, {
                field: field
            }, /*#__PURE__*/ React.createElement(SettingToggle, {
                id: field.id,
                value: Settings.getFieldValue(id),
                onSelected: (checked)=>{
                    setValue(checked);
                    field.onSelected?.(checked);
                },
                className: "x-settings-button"
            }));
        };
        this.InputField = (field)=>{
            const id = this.getId(field.id);
            const [value, setValue] = this.useStateFor(id);
            return /*#__PURE__*/ React.createElement(this.SettingField, {
                field: field
            }, /*#__PURE__*/ React.createElement("input", {
                className: "x-settings-input",
                id: field.id,
                dir: "ltr",
                value: Settings.getFieldValue(id),
                type: field.inputType,
                onChange: (e)=>{
                    const value = e.currentTarget.value;
                    setValue(value);
                    field.onChange?.(value);
                }
            }));
        };
        this.proxy = new Proxy({}, {
            get: (target, prop)=>Settings.getFieldValue(this.getId(prop.toString())),
            set: (target, prop, newValue)=>{
                const id = this.getId(prop.toString());
                if (Settings.getFieldValue(id) !== newValue) {
                    Settings.setFieldValue(id, newValue);
                }
                return true;
            }
        });
    }
    static fromModule(mod) {
        return new Settings(mod.getName(), mod.getModuleIdentifier());
    }
    get cfg() {
        return this.proxy;
    }
    finalize;
    addButton;
    addToggle;
    addInput;
    addField(type, opts, fieldComponent, defaultValue) {
        if (defaultValue !== undefined) {
            const settingId = this.getId(opts.id);
            Settings.setDefaultFieldValue(settingId, defaultValue);
        }
        const field = Object.assign({}, opts, {
            type
        });
        this.sectionFields[opts.id] = React.createElement(fieldComponent, field);
    }
    getId;
    useStateFor;
    static getFieldValue = (id)=>JSON.parse(localStorage[id] ?? "null");
    static setFieldValue = (id, newValue)=>{
        localStorage[id] = JSON.stringify(newValue ?? null);
    };
    static setDefaultFieldValue = async (id, defaultValue)=>{
        if (Settings.getFieldValue(id) === null) Settings.setFieldValue(id, await defaultValue());
    };
    SettingsSection;
    SettingField;
    ButtonField;
    ToggleField;
    InputField;
}
export const createSettings = (mod)=>{
    if (!mod.settings) {
        mod.settings = Settings.fromModule(mod);
    }
    return [
        mod.settings,
        /*#__PURE__*/ React.createElement(SettingsButton, {
            section: mod.settings.getName()
        })
    ];
};
