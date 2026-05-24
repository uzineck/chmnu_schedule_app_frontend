import { useEffect } from "react";

/**
 * Locks body scroll while any antd modal mask is present in the DOM.
 *
 * antd v5 sets `body { overflow: hidden }` while a modal is open, but on iOS
 * Safari that alone doesn't fully prevent touch scrolling — the page beneath
 * the modal still scrolls. This hook layers an iOS-safe `position: fixed`
 * lock on top, watching the DOM for any `.ant-modal-mask` and counting them
 * (multiple stacked modals stay locked until the last closes). The original
 * scroll position is restored on unlock.
 *
 * Call once at app root.
 */
export const useModalBodyLock = () => {
    useEffect(() => {
        let locked = false;
        let savedScrollY = 0;

        const lock = () => {
            if (locked) return;
            savedScrollY = window.scrollY;
            const body = document.body;
            body.style.position = "fixed";
            body.style.top = `-${savedScrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            locked = true;
        };

        const unlock = () => {
            if (!locked) return;
            const body = document.body;
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" as ScrollBehavior });
            locked = false;
        };

        const sync = () => {
            // Active = a modal mask is mounted AND not in its "hidden" state
            // (antd toggles a `ant-modal-mask-hidden` class while animating out).
            const masks = document.querySelectorAll(".ant-modal-mask");
            const anyActive = Array.from(masks).some(
                (el) => !el.classList.contains("ant-modal-mask-hidden"),
            );
            if (anyActive) lock();
            else unlock();
        };

        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "style"],
        });

        return () => {
            observer.disconnect();
            unlock();
        };
    }, []);
};
