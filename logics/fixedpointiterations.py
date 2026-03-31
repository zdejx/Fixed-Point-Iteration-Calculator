import sympy as sym
from sympy import *
    
class fixedpointiterations():
    x = symbols('x')
    def GetAB(self, GetGiven, f_a, f_b,):
        x = self.x
        
        try:
            given = sympify(GetGiven)
            a, b = float(f_a), float(f_b)
            x0 = (a + b) / 2
            
            tryA = float(given.subs(x, a))
            tryB = float(given.subs(x, b))
    
            if (tryA * tryB) < 0:
                return {"success": True, "x0": x0, "f_a": tryA, "f_b": tryB, "given": given}
            else:
                # Specific error for the Root Guarantee (Intermediate Value Theorem)
                if (tryA * tryB) >= 0:
                    return {
                        "success": False,
                        "error": f"f(a) and f(b) have the same sign ({tryA}, {tryB}). No guaranteed root in this interval."
                    }
                # Specific error for your x0 constraint
                elif x0 <= 0:
                    return {
                        "success": False,
                        "error": f"Initial guess x0 ({x0}) must be greater than 0 for this method."
                    }
        except Exception:
            return {"success": False, "error": "Check your equation syntax!"}
                                    
    def GetGx(self, interval, input_gx):
        x = self.x
        
        try:
            g_of_x = sympify(input_gx)
            g_prime_x = diff(g_of_x, x)
            abs_gx = Float(Abs(g_prime_x.subs(x, interval)))
            #print('-=-' * 15)
            #print(f"g(x) = {g_of_x} ")
            #print(f"g'(x) = {g_prime_x}")
            #print(f"|g'(1.5)| = {abs_gx}")
            #print(f"5 decimal number: {round(abs_gx, 5)}")
            if abs_gx < 1:
                #print(f"{round(abs_gx, 5)} is less than 1. \nCONVERGENT")
                #print('-=-' * 15)
                #return g_of_x
                return {
                    "success": True,
                    "g_of_x": g_of_x,
                    "g_prime_x": g_prime_x,
                    "abs_gx": abs_gx,          
                }
            else:
                #print(f"{round(abs_gx, 5)} is greater than 1. \nDIVERGENT, please try another derivation of the formula.")
                #print('-=-' * 15)     
                return {
                    "success": False,
                    "error": f"{round(abs_gx, 5)} is greater than 1. \nDIVERGENT, please try another derivation of the formula."
                }         
        except Exception:
            return {"success": False, "error": "Check your equation syntax!"}
                
    def GetApprox(self, gx, interval):
        x = self.x
        x_current = (interval)
        iterations = []
        rel_error_counter = []
        rel_error = 100.0
        counter = 0
        stopping_point = 0.00001
        max_iterations = 100
        
        
        while rel_error > stopping_point and counter < max_iterations:
            aprx_next = round(float(gx.subs(x, x_current)), 5)
            iterations.append(round(aprx_next, 5))
            rel_error = abs(round((aprx_next - x_current) / aprx_next * 100, 5))
            rel_error_counter.append(rel_error)
            counter += 1
            x_current = aprx_next
        
        if rel_error <= stopping_point:
            for i in range(len(iterations)):
                print(f'{i+1}. {iterations[i]:.5f} || Relative error = {rel_error_counter[i]:.5f}%')
        
        if counter >= max_iterations:
            print("\nDIVERGENCE DETECTED!")
            print(f"Reached {max_iterations} iterations without converging.")
            print("The values are likely oscillating or spiraling away from the root.")
            print("Please go back and try a different g(x) formula.")   

            
        