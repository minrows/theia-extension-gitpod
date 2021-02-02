import { FrontendApplicationContribution } from "@theia/core/lib/browser";
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser';
export declare const AssistanceCommand: {
    id: string;
    label: string;
};
export declare class markingElements implements FrontendApplicationContribution {
    private readonly fileService;
    private readonly workspaceService;
    idList: Array<string>;
    currentHint: number;
    observer: MutationObserver | null;
    leftPostion: number;
    topPosition: number;
    constructor(fileService: FileService, workspaceService: WorkspaceService);
    findNewCurrent: () => void;
    asId: (id: string) => string;
    asContent: (content: string) => string;
    markCurrent: () => void;
    currentLeftPosition: () => number;
    currentTopPosition: () => number;
    finishAssistance: () => void;
    cleanUp: () => void;
    prepareNextStep: () => void;
    observe: () => void;
    initialize(): void;
}
//# sourceMappingURL=assistance-contribution.d.ts.map