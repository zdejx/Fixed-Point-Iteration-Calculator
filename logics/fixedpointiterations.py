import sympy as sym
from sympy import *
    
class fixedpointiterations():
    x = symbols('x')
    def GetAB(self, GetGiven, f_a, f_b,):
        x = self.x

        try:
            given = sympify(GetGiven) #turns the equation from string to a valid equation
            a, b = float(f_a), float(f_b) #[a,b]
            x0 = (a + b) / 2 
            
            tryA = float(given.subs(x, a)) #f(a)
            tryB = float(given.subs(x, b)) #f(b)
    
            if (tryA * tryB) < 0: #checks for real root, if may real root, get interval
                return {"success": True, "x0": x0, "f_a": tryA, "f_b": tryB, "given": given}
            else:
                # Specific error for the Root Guarantee (Intermediate Value Theorem) same sign so this line will execute
                if (tryA * tryB) >= 0:
                    return {
                        "success": False,
                        "error": f"f(a) and f(b) have the same sign ({tryA}, {tryB}). No guaranteed root in this interval."
                    }
                # Just in case that the a & b is opposite sign but the interval is less than 0
                elif x0 <= 0:
                    return {
                        "success": False,
                        "error": f"Initial guess x0 ({x0}) must be greater than 0 for this method."
                    }
        #invalid equation
        except Exception:
            return {"success": False, "error": "Check your equation syntax!"}
                                    
                            
    #convergence or divergence checker
    def GetGx(self, interval, input_gx): 
        x = self.x
        
        try:
            g_of_x = sympify(input_gx) #sympify the string equation
            g_prime_x = diff(g_of_x, x) #derive g(x) to get g'(x)
            abs_gx = Float(Abs(g_prime_x.subs(x, interval))) #get absolute value of g'(x) to check if it is < 1 or > 1
            if abs_gx < 1: #for convergent
                return {
                    "success": True,
                    "g_of_x": g_of_x,
                    "g_prime_x": g_prime_x,
                    "abs_gx": abs_gx,          
                }
            else: #divergent
                return {
                    "success": False,
                    "error": f"{round(abs_gx, 5)} is greater than 1. \nDIVERGENT, please try another derivation of the formula.",
                    "g_prime_x": g_prime_x,
                    "abs_gx": abs_gx
                }         
        except Exception: #invalid equation
            return {"success": False, "error": "Check your equation syntax!"}
           
    #Approximate value, with iterations     
    def GetApprox(self, gx, interval, stopping_point, roundoff):
        x = self.x
        x_current = (interval)
        iterations = []
        rel_error_counter = []
        rel_error = 100.0
        counter = 0
        stopping_point = stopping_point
        max_iterations = 100
        roundoff = roundoff
        
        
        try:
            #while there is still a relative error value and has not reached the stopping AND the counter is still less than the max iteration (100)
            while rel_error > stopping_point and counter < max_iterations: 
                aprx_next = round(float(gx.subs(x, x_current)), roundoff)
                iterations.append(round(aprx_next, roundoff))
                rel_error = abs(round((aprx_next - x_current) / aprx_next * 100, roundoff))
                rel_error_counter.append(rel_error)
                counter += 1
                x_current = aprx_next
            
            #if the relative error reached the stopping point
            if rel_error <= stopping_point:
                return {
                        "success": True,
                        "iterations": iterations,
                        "rel_error_counter": rel_error_counter,
                    }
            
            #if the counter exceeded max iteration
            if counter >= max_iterations:
                return {
                    "success": False,
                    "error": f"Reached {max_iterations} iterations without converging. The equation is spiraling and it is ultimately divergent."
                }
                
        except Exception: #invalid equation
            return {"success": False, "error": "Check your equation syntax!"}
        
        

            
        