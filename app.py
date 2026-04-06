from flask import Flask, render_template, request
from logics.fixedpointiterations import fixedpointiterations

app = Flask(__name__)

#this is the url name, ignore lang most of the time
@app.route('/')
def index(): #name of the page 
<<<<<<< HEAD
    #looks for the .html file in templates
    return render_template('index.html')
=======
    return render_template('index.html') #loads the file that will show in the website
>>>>>>> f645883 (added comments and cleaned the code)

@app.route('/fixed-point-iterations', methods=['POST', 'GET'])
def FixedPointIteration_page():
    result = None
<<<<<<< HEAD
    if request.method == 'POST':
        # Use 'equation' as the key to match the 'name' attribute in your HTML
=======
    if request.method == 'POST': #gets the information after the user presses calculate
>>>>>>> f645883 (added comments and cleaned the code)
        given = request.form.get('equation')
        interval_val = request.form.get('x0')
        stop_val = request.form.get('stopping_point')
        round_val = request.form.get('roundoff')
        
        solver = fixedpointiterations()
        
        try:
<<<<<<< HEAD
            # 1. First, check for convergence/syntax using GetGx
            # We convert inputs to numerical types here for the logic functions
            gx_result = solver.GetGx(float(interval_val), given)
            result = gx_result # Initialize with derivation info (g', abs_gx, etc)
            result['given'] = given
            result['x0'] = interval_val
            
            if gx_result['success']:
                # 2. If convergent, proceed to calculate iterations
                approx = solver.GetApprox(gx_result['g_of_x'], float(interval_val), float(stop_val), int(round_val))
                
                # Merge iteration results into the main result dictionary
                # This preserves g_prime_x and abs_gx from the first step
                result.update(approx)
                
            # If GetGx failed (divergent), 'result' already contains the error message

=======
            #function tries to check if the g(x) is a proper equation, and if so run GetGx func that will
            #tell the user if its convergent or divergent
            gx_result = solver.GetGx(float(interval_val), given)
            result = gx_result 
            result['given'] = given
            result['x0'] = interval_val
            
            #if gx_resutt is convergent, proceed to execute the final function GetApprox which gets us the iterations and
            #the relative error.
            if gx_result['success']: 
                approx = solver.GetApprox(gx_result['g_of_x'], float(interval_val), float(stop_val), int(round_val))
                
                # updates the array and appends the iterations to its array
                result.update(approx)
                
            #if gx_result is divergent, there is already an error message for it.

        #if the equation is invalid (meaning it didn't get sympified), this will run
>>>>>>> f645883 (added comments and cleaned the code)
        except Exception as e:
            result = {"success": False, "error": f"Input error: {str(e)}"}
            
    return render_template('fixedpointiterations.html', result=result)

<<<<<<< HEAD
@app.route('/Interval', methods=['POST', 'GET'])
=======

#This block is for getting the interval of f(x) functions
@app.route('/Interval', methods=['POST', 'GET']) 
>>>>>>> f645883 (added comments and cleaned the code)
def Interval_page():
    result = None
    if request.method == 'POST':
        given = request.form.get('equation')
        f_a_value = request.form.get('f_a')
        f_b_value = request.form.get('f_b')
        
<<<<<<< HEAD
=======
        #sends the value to GetAB (interval) function and return its value back
>>>>>>> f645883 (added comments and cleaned the code)
        solver = fixedpointiterations()
        result = solver.GetAB(given, f_a_value, f_b_value)
    
    return render_template('Intervalcalculator.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)
    