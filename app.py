from flask import Flask, render_template, request
from logics.fixedpointiterations import fixedpointiterations

app = Flask(__name__)

#this is the url name, ignore lang most of the time
@app.route('/')
def index(): #name of the page 
    #looks for the .html file in templates
    return render_template('index.html')

@app.route('/fixed-point-iterations')
def FixedPointIteration_page():
    result = None
    if request.method == 'POST':
        given = request.form.get('g_of_x')
        interval = request.form.get('Interval')
        solver = fixedpointiterations()
        
        result = solver.GetApprox(given, interval)
    return render_template('fixedpointiterations.html', result=result)

@app.route('/Interval', methods=['POST', 'GET'])
def Interval_page():
    result = None
    if request.method == 'POST':
        given = request.form.get('equation')
        f_a_value = request.form.get('f_a')
        f_b_value = request.form.get('f_b')
        
        solver = fixedpointiterations()
        result = solver.GetAB(given, f_a_value, f_b_value)
    
    return render_template('Intervalcalculator.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)