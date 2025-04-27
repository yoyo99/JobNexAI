var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
const AutomatedApplyButton = ({ jobId, disabled }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleAutomatedApply = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsApplying(true);
        setSuccess(false);
        // Simulation (à remplacer par appel API réelle)
        yield new Promise((res) => setTimeout(res, 1500));
        setIsApplying(false);
        setSuccess(true);
    });
    return (_jsx("div", { className: "my-2", children: _jsx("button", { className: "btn-primary", onClick: handleAutomatedApply, disabled: isApplying || disabled, children: isApplying ? 'Candidature en cours...' : success ? 'Candidature envoyée !' : 'Candidater automatiquement' }) }));
};
export default AutomatedApplyButton;
