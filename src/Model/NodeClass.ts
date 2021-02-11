/**
 * Cette classe permet de donner la structure d'une classe concrete
 */
import { ClassDeclaration, HeritageClause, Project, SourceFile, Type, TypeFlags } from "ts-morph";
import * as _ from "lodash";
import { Link } from "./Link";
import { EXTENDS, IMPLEMENTS, CLASS, INTERFACE } from "./Keyword";
import { link } from "fs";

export class NodeClass {
    protected name: string;
    private sourceFile: SourceFile;

    constructor(name: string) {
        this.name = name
        this.getSourceFile();
    }

    // Permet de determiner si une autre classe a un lien (heritage ou implementation) 
    // d'une autre classe
    hasLink(): boolean {
        if (!_.isUndefined(this.sourceFile)) {
            return !_.isEmpty(this.getHeritageClauses());
        } else {
            return false;
        }
    }

    // Retourne un array de parent si ils existent
    getHeritageClauses(): HeritageClause[] {
        let classDeclaration = this.sourceFile.getClass(this.name);
        return classDeclaration.getHeritageClauses();
    }

    // Retourne le fichier source
    loadSourceFile(): SourceFile | undefined {
        const project = new Project();
        // Pour l'instant le chemin ne peut être que dans sample-ts, on pourrait étendre cela plus tard
        let path = "./sample-ts/" + this.name + ".ts";
        return project.addSourceFileAtPath(path);
    }

    getLinkElements(): Array<Link> {
        let linkElement = Array<Link>();
        if (this.hasLink()) {
            this.getHeritageClauses().forEach(element => {
                let text = element.getText();

                element.getTypeNodes().forEach(item => {
                    if (text.includes(EXTENDS)) {
                        linkElement.push(new Link(EXTENDS,CLASS, item.getText()))
                    } else if (text.includes(IMPLEMENTS)) {
                        linkElement.push(new Link(IMPLEMENTS,INTERFACE, item.getText()))
                    }
                });
            });
        }

        return linkElement;
    }

    getSourceFile(): void {
        this.sourceFile = this.loadSourceFile();
    }

}