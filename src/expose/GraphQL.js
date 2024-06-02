/*
 * Copyright (C) 2024 Delusoire
 * SPDX-License-Identifier: GPL-3.0-or-later
 */ import { transformer } from "../../mixin.js";
export const GraphQLDefs = {
    query: {},
    mutation: {}
};
transformer((emit)=>(str)=>{
        const matches = str.matchAll(/(=new [a-zA-Z_\$][\w\$]*\.[a-zA-Z_\$][\w\$]*\("(?<name>\w+)","(?<operation>query|mutation)","(?<sha256Hash>[\w\d]{64})",null\))/g);
        for (const match of matches){
            const { name, operation, sha256Hash } = match.groups;
            // @ts-ignore
            GraphQLDefs[operation][name] = {
                name,
                operation,
                sha256Hash,
                value: null
            };
        }
        emit();
        return str;
    }, {
    glob: /.+\.js$/
});
