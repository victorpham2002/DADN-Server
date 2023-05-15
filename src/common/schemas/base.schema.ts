export class BaseSchema{

    static isRegisterHooks = false;
    static registerHooks = (registerFunc, cls) => {
        
        if(cls.isRegisterHooks) return;
        registerFunc();
        cls.isRegisterHooks = true;
    }

}